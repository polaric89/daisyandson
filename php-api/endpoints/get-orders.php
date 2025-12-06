<?php
/**
 * GET /api/orders
 * Get all orders (admin endpoint)
 */

require_once __DIR__ . '/../config.php';

$db = getDB();

try {
    // Get all orders
    $ordersStmt = $db->query("
        SELECT o.*
        FROM orders o
        ORDER BY o.timestamp DESC
    ");
    $orders = $ordersStmt->fetchAll();
    
    // Get all payments
    $paymentsStmt = $db->query("SELECT order_id, payment_data FROM payments");
    $payments = [];
    while ($payment = $paymentsStmt->fetch()) {
        $payments[$payment['order_id']] = json_decode($payment['payment_data'], true);
    }
    
    // Combine orders with designs and payments
    $result = [];
    foreach ($orders as $order) {
        $orderData = [
            'id' => $order['id'],
            'category' => $order['category'],
            'quantity' => (int)$order['quantity'],
            'pricing' => json_decode($order['pricing'], true),
            'shipping' => json_decode($order['shipping'], true),
            'referralId' => $order['referral_id'],
            'status' => $order['status'],
            'buyerInfo' => json_decode($order['buyer_info'], true),
            'timestamp' => $order['timestamp']
        ];
        
        // Get designs for this order separately (GROUP_CONCAT breaks JSON with commas in base64)
        $designsStmt = $db->prepare("SELECT design_data, image_path FROM designs WHERE order_id = ? ORDER BY id");
        $designsStmt->execute([$order['id']]);
        $designs = [];
        $designRows = $designsStmt->fetchAll();
        
        // If no designs in database, try to find image files by order ID
        if (empty($designRows)) {
            error_log("No designs found in database for order {$order['id']}, searching for image files...");
            // Try multiple patterns to find files
            $orderIdParts = explode('-', $order['id']);
            $timestamp = $orderIdParts[0] ?? '';
            $hash = $orderIdParts[1] ?? '';
            
            $patterns = [
                UPLOAD_DIR . $order['id'] . '-design-*.png',  // Full order ID
                UPLOAD_DIR . '*' . $hash . '*design*.png',     // By hash part only
                UPLOAD_DIR . '*' . $timestamp . '*design*.png' // By timestamp
            ];
            
            foreach ($patterns as $pattern) {
                $imageFiles = glob($pattern);
                foreach ($imageFiles as $imageFile) {
                    if (file_exists($imageFile)) {
                        $fileName = basename($imageFile);
                        $imageData = file_get_contents($imageFile);
                        if ($imageData !== false) {
                            $designs[] = [
                                'id' => count($designs) + 1,
                                'image' => 'data:image/png;base64,' . base64_encode($imageData),
                                'imagePath' => '/uploads/' . $fileName
                            ];
                            error_log("Found and loaded image file: $fileName for order {$order['id']}");
                        }
                    }
                }
                if (!empty($designs)) break; // Found files, stop searching
            }
        } else {
            // Process designs from database
            foreach ($designRows as $designRow) {
                $designData = json_decode($designRow['design_data'], true);
                if ($designData) {
                    // Check if base64 image exists and is valid
                    $hasValidBase64 = isset($designData['image']) && 
                                     !empty($designData['image']) && 
                                     strlen($designData['image']) > 100 &&
                                     strpos($designData['image'], 'data:image') === 0;
                    
                    // If no valid base64, try to load from file
                    if (!$hasValidBase64) {
                        $fileName = null;
                        $filePath = null;
                        
                        // Try stored image_path first
                        if ($designRow['image_path']) {
                            $fileName = basename($designRow['image_path']);
                            $filePath = UPLOAD_DIR . $fileName;
                        }
                        
                        // If file doesn't exist, search by order ID pattern
                        if (!$filePath || !file_exists($filePath)) {
                            $orderIdParts = explode('-', $order['id']);
                            $timestamp = $orderIdParts[0] ?? '';
                            $hash = $orderIdParts[1] ?? '';
                            
                            // Try multiple patterns
                            $patterns = [
                                UPLOAD_DIR . $order['id'] . '-design-*.png',  // Full order ID
                                UPLOAD_DIR . '*' . $hash . '*design*.png',     // By hash part
                                UPLOAD_DIR . '*' . $timestamp . '*design*.png' // By timestamp
                            ];
                            
                            foreach ($patterns as $pattern) {
                                $matches = glob($pattern);
                                if (!empty($matches)) {
                                    $filePath = $matches[0];
                                    $fileName = basename($filePath);
                                    break;
                                }
                            }
                        }
                        
                        // Load image from file
                        if ($filePath && file_exists($filePath)) {
                            $imageData = file_get_contents($filePath);
                            if ($imageData !== false) {
                                $designData['image'] = 'data:image/png;base64,' . base64_encode($imageData);
                                error_log("Loaded image from file: $fileName for order {$order['id']}");
                            }
                        } else {
                            error_log("Could not find image file for order {$order['id']}. Tried path: " . ($filePath ?? 'none'));
                        }
                    }
                    
                    // Only add design if it has a valid image
                    if (isset($designData['image']) && !empty($designData['image']) && strlen($designData['image']) > 100) {
                        $designs[] = $designData;
                    } else {
                        error_log("Skipping design without valid image for order {$order['id']}");
                    }
                }
            }
            
            // If we still have no designs with images, do a final search for files
            if (empty($designs)) {
                error_log("No designs with images found in database for order {$order['id']}, doing final file search...");
                $orderIdParts = explode('-', $order['id']);
                $hash = $orderIdParts[1] ?? '';
                $pattern = UPLOAD_DIR . '*' . $hash . '*design*.png';
                $imageFiles = glob($pattern);
                foreach ($imageFiles as $imageFile) {
                    if (file_exists($imageFile)) {
                        $fileName = basename($imageFile);
                        $imageData = file_get_contents($imageFile);
                        if ($imageData !== false) {
                            $designs[] = [
                                'id' => count($designs) + 1,
                                'image' => 'data:image/png;base64,' . base64_encode($imageData),
                                'imagePath' => '/uploads/' . $fileName
                            ];
                            error_log("Final search found image: $fileName for order {$order['id']}");
                        }
                    }
                }
            }
        }
        
        error_log("Total designs for order {$order['id']}: " . count($designs));
        $orderData['designs'] = $designs;
        
        // Add payment details if available
        if (isset($payments[$order['id']])) {
            $orderData['paymentDetails'] = $payments[$order['id']];
        }
        
        $result[] = $orderData;
    }
    
    sendJSON($result);
    
} catch (Exception $e) {
    error_log("Error getting orders: " . $e->getMessage());
    sendJSON(['error' => 'Failed to get orders'], 500);
}

?>

