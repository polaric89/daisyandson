<?php
/**
 * GET /api/orders/track-by-email/:email
 * Track order by PayPal email (public endpoint for customers)
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$email = getRouteParam('email');
$db = getDB();

try {
    if (empty($email)) {
        sendJSON(['error' => 'Email is required'], 400);
    }
    
    // URL decode the email (in case @ is encoded as %40)
    $email = urldecode($email);
    
    // Normalize email (lowercase, trim)
    $email = strtolower(trim($email));
    
    error_log("=== TRACK ORDER BY EMAIL ===");
    error_log("Original email param: " . getRouteParam('email'));
    error_log("URL decoded email: $email");
    error_log("Normalized email: $email");
    
    // Helper function to extract email from payment data (recursive search)
    function extractEmailFromPayment($data, $searchedEmail) {
        if (!is_array($data)) {
            return null;
        }
        
        // Check common email field names (case-insensitive)
        $emailFields = ['payerEmail', 'payer_email', 'email', 'email_address', 'payerEmailAddress'];
        
        foreach ($emailFields as $field) {
            // Check direct field
            if (isset($data[$field]) && !empty($data[$field])) {
                $foundEmail = strtolower(trim($data[$field]));
                if ($foundEmail === $searchedEmail) {
                    return $foundEmail;
                }
            }
            
            // Check camelCase variations
            $camelCase = lcfirst(str_replace('_', '', ucwords($field, '_')));
            if (isset($data[$camelCase]) && !empty($data[$camelCase])) {
                $foundEmail = strtolower(trim($data[$camelCase]));
                if ($foundEmail === $searchedEmail) {
                    return $foundEmail;
                }
            }
        }
        
        // Check nested payer object
        if (isset($data['payer']) && is_array($data['payer'])) {
            $payerEmail = extractEmailFromPayment($data['payer'], $searchedEmail);
            if ($payerEmail) {
                return $payerEmail;
            }
        }
        
        // Recursively search nested arrays
        foreach ($data as $value) {
            if (is_array($value)) {
                $foundEmail = extractEmailFromPayment($value, $searchedEmail);
                if ($foundEmail) {
                    return $foundEmail;
                }
            }
        }
        
        return null;
    }
    
    // Search for payments with matching PayPal email
    error_log("Searching for orders with email: $email");
    $paymentsStmt = $db->query("SELECT order_id, payment_data, saved_at FROM payments ORDER BY saved_at DESC");
    $matchingOrderIds = [];
    $totalPayments = 0;
    
    while ($payment = $paymentsStmt->fetch()) {
        $totalPayments++;
        $paymentData = json_decode($payment['payment_data'], true);
        if ($paymentData) {
            // First try direct field access (most common case)
            $payerEmail = null;
            if (isset($paymentData['payerEmail'])) {
                $payerEmail = strtolower(trim($paymentData['payerEmail']));
            } elseif (isset($paymentData['payer_email'])) {
                $payerEmail = strtolower(trim($paymentData['payer_email']));
            } elseif (isset($paymentData['email'])) {
                $payerEmail = strtolower(trim($paymentData['email']));
            } else {
                // Use recursive function to find email in nested structures
                $payerEmail = extractEmailFromPayment($paymentData, $email);
            }
            
            // Log what we found
            if ($payerEmail) {
                error_log("Found email in payment for order {$payment['order_id']}: '$payerEmail' (searching for: '$email')");
                if ($payerEmail === $email) {
                    $matchingOrderIds[] = $payment['order_id'];
                    error_log("✓ MATCH FOUND! Order ID: {$payment['order_id']}, Email: $payerEmail");
                } else {
                    error_log("✗ Email mismatch: '$payerEmail' != '$email'");
                }
            } else {
                error_log("No email found in payment data for order {$payment['order_id']}. Payment keys: " . implode(', ', array_keys($paymentData)));
            }
        } else {
            error_log("Payment data could not be decoded for order {$payment['order_id']}");
        }
    }
    
    // Also check buyer_info email (primary method for card payments)
    error_log("Checking buyer_info emails...");
    $ordersStmt = $db->query("SELECT id, buyer_info FROM orders WHERE buyer_info IS NOT NULL ORDER BY timestamp DESC");
    while ($order = $ordersStmt->fetch()) {
        $buyerInfo = json_decode($order['buyer_info'], true);
        if ($buyerInfo && isset($buyerInfo['email'])) {
            $buyerEmail = strtolower(trim($buyerInfo['email']));
            if ($buyerEmail === $email) {
                // Only add if not already in the list
                if (!in_array($order['id'], $matchingOrderIds)) {
                    $matchingOrderIds[] = $order['id'];
                    error_log("Match found in buyer_info! Order ID: {$order['id']}, Email: $buyerEmail");
                }
            }
        }
    }
    
    error_log("Total payments checked: $totalPayments, Matches found: " . count($matchingOrderIds));
    
    if (empty($matchingOrderIds)) {
        // Return helpful debug info
        $debugInfo = [
            'searchedEmail' => $email,
            'totalPayments' => $totalPayments,
            'message' => 'No orders found with this email. Please verify the email address matches the one used in PayPal.'
        ];
        
        // Log actual payment data structure for debugging (all payments)
        if ($totalPayments > 0) {
            $sampleStmt = $db->query("SELECT order_id, payment_data FROM payments ORDER BY saved_at DESC LIMIT 5");
            $samples = [];
            while ($sample = $sampleStmt->fetch()) {
                $sampleData = json_decode($sample['payment_data'], true);
                if ($sampleData) {
                    $samples[] = [
                        'order_id' => $sample['order_id'],
                        'keys' => array_keys($sampleData),
                        'payerEmail' => $sampleData['payerEmail'] ?? 'NOT FOUND',
                        'payer_email' => $sampleData['payer_email'] ?? 'NOT FOUND',
                        'email' => $sampleData['email'] ?? 'NOT FOUND'
                    ];
                }
            }
            $debugInfo['samplePayments'] = $samples;
        }
        
        sendJSON(['error' => 'Order not found', 'debug' => $debugInfo], 404);
    }
    
    // Helper function to format a single order with all its data
    function formatOrder($orderId, $db) {
        // Get order
        $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();
        
        if (!$order) {
            return null;
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
        
        return [
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
        ];
    }
    
    // Get ALL matching orders (sorted by most recent first)
    $allOrders = [];
    if (count($matchingOrderIds) > 0) {
        $placeholders = str_repeat('?,', count($matchingOrderIds) - 1) . '?';
        $ordersStmt = $db->prepare("SELECT id FROM orders WHERE id IN ($placeholders) ORDER BY timestamp DESC");
        $ordersStmt->execute($matchingOrderIds);
        $orderIds = $ordersStmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($orderIds as $orderId) {
            $formattedOrder = formatOrder($orderId, $db);
            if ($formattedOrder) {
                $allOrders[] = $formattedOrder;
            }
        }
    }
    
    if (empty($allOrders)) {
        sendJSON(['error' => 'Order not found'], 404);
    }
    
    // If only one order, return it directly (for backward compatibility)
    // If multiple orders, return as array
    if (count($allOrders) === 1) {
        sendJSON($allOrders[0]);
    } else {
        sendJSON([
            'orders' => $allOrders,
            'count' => count($allOrders)
        ]);
    }
    
} catch (Exception $e) {
    error_log("Error tracking order by email: " . $e->getMessage());
    sendJSON(['error' => 'Failed to track order'], 500);
}

?>

