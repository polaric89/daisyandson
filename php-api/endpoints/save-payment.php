<?php
/**
 * POST /api/save-payment
 * Saves PayPal payment response details
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$input = getJSONInput();
$db = getDB();

try {
    if (empty($input['orderId'])) {
        sendJSON(['error' => 'No payment order ID provided'], 400);
    }
    
    $paymentId = generateId();
    $paymentData = json_encode($input);
    
    $stmt = $db->prepare("
        INSERT INTO payments (id, order_id, payment_data, saved_at)
        VALUES (?, ?, ?, NOW())
    ");
    
    $stmt->execute([$paymentId, $input['orderId'], $paymentData]);
    
    sendJSON([
        'success' => true,
        'message' => 'Payment saved successfully'
    ]);
    
} catch (Exception $e) {
    error_log("Error saving payment: " . $e->getMessage());
    sendJSON(['error' => 'Failed to save payment'], 500);
}

?>

