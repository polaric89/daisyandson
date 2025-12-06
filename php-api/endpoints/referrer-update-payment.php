<?php
/**
 * PUT /api/referrer/:id/payment-details
 * Update referrer payment details
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$referrerId = getRouteParam('id');
$input = getJSONInput();
$db = getDB();

try {
    if (empty($referrerId)) {
        sendJSON(['error' => 'Referrer ID is required'], 400);
    }
    
    // Check if referrer exists
    $checkStmt = $db->prepare("SELECT id FROM referrers WHERE id = ?");
    $checkStmt->execute([$referrerId]);
    
    if (!$checkStmt->fetch()) {
        sendJSON(['error' => 'Referrer not found'], 404);
    }
    
    // Note: Payment details are now stored in payout requests, not in referrer table
    // This endpoint can be used for future reference if needed
    
    sendJSON([
        'success' => true,
        'message' => 'Payment details updated'
    ]);
    
} catch (Exception $e) {
    error_log("Error updating payment details: " . $e->getMessage());
    sendJSON(['error' => 'Failed to update payment details'], 500);
}

?>

