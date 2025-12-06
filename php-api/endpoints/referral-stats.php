<?php
/**
 * GET /api/referral-stats/:id
 * Get referral statistics for a user
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$referralId = getRouteParam('id');
$db = getDB();

try {
    if (empty($referralId)) {
        sendJSON(['error' => 'Referral ID is required'], 400);
    }
    
    // Get clicks
    $clicksStmt = $db->prepare("SELECT COUNT(*) as count FROM referral_clicks WHERE referral_id = ?");
    $clicksStmt->execute([$referralId]);
    $clicks = (int)$clicksStmt->fetch()['count'];
    
    // Get conversions
    $conversionsStmt = $db->prepare("
        SELECT * FROM referral_conversions 
        WHERE referral_id = ? 
        ORDER BY timestamp DESC
    ");
    $conversionsStmt->execute([$referralId]);
    $conversions = [];
    $earnings = 0;
    
    while ($conv = $conversionsStmt->fetch()) {
        $earnings += (float)$conv['commission'];
        $conversions[] = [
            'referrerId' => $conv['referral_id'],
            'orderId' => $conv['order_id'],
            'amount' => (float)$conv['amount'],
            'commission' => (float)$conv['commission'],
            'timestamp' => $conv['timestamp'],
            'status' => $conv['status']
        ];
    }
    
    sendJSON([
        'clicks' => $clicks,
        'conversions' => count($conversions),
        'earnings' => round($earnings, 2),
        'conversionDetails' => $conversions
    ]);
    
} catch (Exception $e) {
    error_log("Error getting referral stats: " . $e->getMessage());
    sendJSON(['error' => 'Failed to get referral stats'], 500);
}

?>

