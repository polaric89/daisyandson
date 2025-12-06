<?php
/**
 * GET /api/admin/referrers
 * Get all referrers (admin endpoint)
 */

require_once __DIR__ . '/../config.php';

$db = getDB();

try {
    $stmt = $db->query("
        SELECT r.*,
               COUNT(DISTINCT rc.id) as clicks,
               COUNT(DISTINCT conv.id) as conversions,
               COALESCE(SUM(CASE WHEN o.status = 'completed' THEN conv.commission ELSE 0 END), 0) as total_earnings
        FROM referrers r
        LEFT JOIN referral_clicks rc ON r.referral_code = rc.referral_id
        LEFT JOIN referral_conversions conv ON r.referral_code = conv.referral_id
        LEFT JOIN orders o ON conv.order_id = o.id
        GROUP BY r.id
        ORDER BY r.registered_at DESC
    ");
    
    $referrers = [];
    while ($row = $stmt->fetch()) {
        $referrers[] = [
            'id' => $row['id'],
            'referralCode' => $row['referral_code'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'status' => $row['status'],
            'registeredAt' => $row['registered_at'],
            'stats' => [
                'clicks' => (int)$row['clicks'],
                'conversions' => (int)$row['conversions'],
                'totalEarnings' => round((float)$row['total_earnings'], 2)
            ]
        ];
    }
    
    sendJSON($referrers);
    
} catch (Exception $e) {
    error_log("Error getting referrers: " . $e->getMessage());
    sendJSON(['error' => 'Failed to get referrers'], 500);
}

?>

