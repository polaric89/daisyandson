<?php
/**
 * PUT /api/admin/payouts/:id
 * Process a payout request (mark as paid or reject)
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$payoutId = getRouteParam('id');
$input = getJSONInput();
$db = getDB();

try {
    if (empty($payoutId)) {
        sendJSON(['error' => 'Payout ID is required'], 400);
    }
    
    $action = $input['action'] ?? ''; // 'approve' or 'reject'
    
    if (!in_array($action, ['approve', 'reject'])) {
        sendJSON(['error' => 'Invalid action. Use "approve" or "reject"'], 400);
    }
    
    // Get payout
    $stmt = $db->prepare("SELECT * FROM payouts WHERE id = ?");
    $stmt->execute([$payoutId]);
    $payout = $stmt->fetch();
    
    if (!$payout) {
        sendJSON(['error' => 'Payout not found'], 404);
    }
    
    if ($payout['status'] !== 'pending') {
        sendJSON(['error' => 'Payout has already been processed'], 400);
    }
    
    // Update payout status
    $newStatus = $action === 'approve' ? 'paid' : 'rejected';
    $updateStmt = $db->prepare("
        UPDATE payouts 
        SET status = ?, processed_at = NOW() 
        WHERE id = ?
    ");
    $updateStmt->execute([$newStatus, $payoutId]);
    
    // If approved, update conversion status to completed
    if ($action === 'approve') {
        // This is handled automatically since we only count completed orders
    }
    
    sendJSON([
        'success' => true,
        'message' => "Payout {$action}d successfully",
        'payout' => [
            'id' => $payoutId,
            'status' => $newStatus
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error processing payout: " . $e->getMessage());
    sendJSON(['error' => 'Failed to process payout'], 500);
}

?>

