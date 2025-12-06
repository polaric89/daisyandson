<?php
/**
 * PATCH /api/orders/:id/status
 * Update order status
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$orderId = getRouteParam('id');
$input = getJSONInput();
$db = getDB();

try {
    if (empty($orderId)) {
        sendJSON(['error' => 'Order ID is required'], 400);
    }
    
    $newStatus = $input['status'] ?? '';
    
    if (empty($newStatus)) {
        sendJSON(['error' => 'Status is required'], 400);
    }
    
    // Valid statuses
    $validStatuses = ['pending', 'processing', 'completed', 'shipped', 'cancelled'];
    if (!in_array($newStatus, $validStatuses)) {
        sendJSON(['error' => 'Invalid status'], 400);
    }
    
    // Update order status
    $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$newStatus, $orderId]);
    
    if ($stmt->rowCount() === 0) {
        sendJSON(['error' => 'Order not found'], 404);
    }
    
    // If status changed to completed, update conversion status
    if ($newStatus === 'completed') {
        $updateConvStmt = $db->prepare("
            UPDATE referral_conversions 
            SET status = 'completed' 
            WHERE order_id = ? AND status = 'pending'
        ");
        $updateConvStmt->execute([$orderId]);
    }
    
    sendJSON([
        'success' => true,
        'message' => 'Order status updated',
        'orderId' => $orderId,
        'status' => $newStatus
    ]);
    
} catch (Exception $e) {
    error_log("Error updating order status: " . $e->getMessage());
    sendJSON(['error' => 'Failed to update order status'], 500);
}

?>

