<?php
/**
 * DELETE /api/orders/:id
 * Delete an order
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$orderId = getRouteParam('id');
$db = getDB();

try {
    if (empty($orderId)) {
        sendJSON(['error' => 'Order ID is required'], 400);
    }
    
    // Check if order exists
    $checkStmt = $db->prepare("SELECT id FROM orders WHERE id = ?");
    $checkStmt->execute([$orderId]);
    
    if (!$checkStmt->fetch()) {
        sendJSON(['error' => 'Order not found'], 404);
    }
    
    // Delete order (cascade will delete designs and payments)
    $stmt = $db->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    
    sendJSON([
        'success' => true,
        'message' => 'Order deleted successfully'
    ]);
    
} catch (Exception $e) {
    error_log("Error deleting order: " . $e->getMessage());
    sendJSON(['error' => 'Failed to delete order'], 500);
}

?>

