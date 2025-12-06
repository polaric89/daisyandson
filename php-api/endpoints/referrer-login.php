<?php
/**
 * POST /api/referrer/login
 * Login as existing referrer
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$input = getJSONInput();
$db = getDB();

try {
    if (empty($input['email']) || empty($input['password'])) {
        sendJSON(['error' => 'Email and password are required'], 400);
    }
    
    // Get referrer
    $stmt = $db->prepare("SELECT * FROM referrers WHERE email = ?");
    $stmt->execute([strtolower($input['email'])]);
    $referrer = $stmt->fetch();
    
    if (!$referrer) {
        sendJSON(['error' => 'Invalid email or password'], 401);
    }
    
    // Verify password
    if (!password_verify($input['password'], $referrer['password_hash'])) {
        sendJSON(['error' => 'Invalid email or password'], 401);
    }
    
    if ($referrer['status'] !== 'active') {
        sendJSON(['error' => 'Account is not active. Please contact support.'], 403);
    }
    
    // Get stats
    $clicksStmt = $db->prepare("SELECT COUNT(*) as count FROM referral_clicks WHERE referral_id = ?");
    $clicksStmt->execute([$referrer['referral_code']]);
    $clicks = $clicksStmt->fetch()['count'];
    
    $conversionsStmt = $db->prepare("SELECT COUNT(*) as count FROM referral_conversions WHERE referral_id = ?");
    $conversionsStmt->execute([$referrer['referral_code']]);
    $conversions = $conversionsStmt->fetch()['count'];
    
    $earningsStmt = $db->prepare("
        SELECT SUM(commission) as total 
        FROM referral_conversions 
        WHERE referral_id = ? AND status = 'completed'
    ");
    $earningsStmt->execute([$referrer['referral_code']]);
    $earnings = $earningsStmt->fetch()['total'] ?? 0;
    
    // Get payouts
    $payoutsStmt = $db->prepare("
        SELECT SUM(amount) as total 
        FROM payouts 
        WHERE referrer_id = ? AND status = 'paid'
    ");
    $payoutsStmt->execute([$referrer['id']]);
    $paidAmount = $payoutsStmt->fetch()['total'] ?? 0;
    $pendingEarnings = $earnings - $paidAmount;
    
    sendJSON([
        'success' => true,
        'referrer' => [
            'id' => $referrer['id'],
            'referralCode' => $referrer['referral_code'],
            'name' => $referrer['name'],
            'email' => $referrer['email'],
            'phone' => $referrer['phone'],
            'registeredAt' => $referrer['registered_at']
        ],
        'stats' => [
            'clicks' => (int)$clicks,
            'conversions' => (int)$conversions,
            'totalEarnings' => (float)$earnings,
            'pendingEarnings' => (float)$pendingEarnings,
            'paidEarnings' => (float)$paidAmount
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error logging in referrer: " . $e->getMessage());
    sendJSON(['error' => 'Failed to login'], 500);
}

?>
