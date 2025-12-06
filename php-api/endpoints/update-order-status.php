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
    $validStatuses = ['pending', 'printing', 'processing', 'shipped', 'completed', 'cancelled'];
    if (!in_array($newStatus, $validStatuses)) {
        sendJSON([
            'error' => 'Invalid status',
            'validStatuses' => $validStatuses,
            'receivedStatus' => $newStatus
        ], 400);
    }
    
    // Log the update attempt
    error_log("Updating order $orderId status to: $newStatus");
    
    // Update order status
    $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$newStatus, $orderId]);
    
    $rowsAffected = $stmt->rowCount();
    error_log("Update query executed. Rows affected: $rowsAffected");
    
    if ($rowsAffected === 0) {
        // Check if order exists
        $checkStmt = $db->prepare("SELECT id, status FROM orders WHERE id = ?");
        $checkStmt->execute([$orderId]);
        $existingOrder = $checkStmt->fetch();
        
        if (!$existingOrder) {
            error_log("Order not found: $orderId");
            sendJSON(['error' => 'Order not found'], 404);
        } else {
            error_log("Order exists but status unchanged. Current status: " . $existingOrder['status']);
            // Status might be the same, but still return success
            sendJSON([
                'success' => true,
                'message' => 'Order status unchanged (already set to this status)',
                'orderId' => $orderId,
                'status' => $existingOrder['status']
            ]);
        }
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

