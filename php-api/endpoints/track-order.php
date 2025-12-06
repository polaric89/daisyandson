<?php
/**
 * GET /api/orders/track/:id
 * Track order by Order ID (public endpoint for customers)
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$orderId = getRouteParam('id');
$db = getDB();

try {
    if (empty($orderId)) {
        sendJSON(['error' => 'Order ID is required'], 400);
    }
    
    // Get order
    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    
    if (!$order) {
        sendJSON(['error' => 'Order not found'], 404);
    }
    
    // Get designs with image loading from files
    $designsStmt = $db->prepare("SELECT design_data, image_path FROM designs WHERE order_id = ? ORDER BY id");
    $designsStmt->execute([$orderId]);
    $designs = [];
    $designRows = $designsStmt->fetchAll();
    
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
                    $orderIdParts = explode('-', $orderId);
                    $timestamp = $orderIdParts[0] ?? '';
                    $hash = $orderIdParts[1] ?? '';
                    
                    // Try multiple patterns
                    $patterns = [
                        UPLOAD_DIR . $orderId . '-design-*.png',
                        UPLOAD_DIR . '*' . $hash . '*design*.png',
                        UPLOAD_DIR . '*' . $timestamp . '*design*.png'
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
                    }
                }
            }
            
            // Only add design if it has a valid image
            if (isset($designData['image']) && !empty($designData['image']) && strlen($designData['image']) > 100) {
                $designs[] = $designData;
            }
        }
    }
    
    // If no designs found, try to find image files
    if (empty($designs)) {
        $orderIdParts = explode('-', $orderId);
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
                }
            }
        }
    }
    
    // Get payment
    $paymentStmt = $db->prepare("SELECT payment_data FROM payments WHERE order_id = ? LIMIT 1");
    $paymentStmt->execute([$orderId]);
    $paymentRow = $paymentStmt->fetch();
    $paymentDetails = $paymentRow ? json_decode($paymentRow['payment_data'], true) : null;
    
    sendJSON([
        'id' => $order['id'],
        'category' => $order['category'],
        'quantity' => (int)$order['quantity'],
        'designs' => $designs,
        'pricing' => json_decode($order['pricing'], true),
        'shipping' => json_decode($order['shipping'], true),
        'status' => $order['status'],
        'buyerInfo' => json_decode($order['buyer_info'], true),
        'paymentDetails' => $paymentDetails,
        'payment' => $paymentDetails, // Also include as 'payment' for frontend compatibility
        'timestamp' => $order['timestamp']
    ]);
    
} catch (Exception $e) {
    error_log("Error tracking order: " . $e->getMessage());
    sendJSON(['error' => 'Failed to track order'], 500);
}

?>

