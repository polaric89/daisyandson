<?php
/**
 * POST /api/record-conversion
 * Records a referral conversion (sale)
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$input = getJSONInput();
$db = getDB();

try {
    if (empty($input['referrerId'])) {
        sendJSON(['error' => 'No referrer ID provided'], 400);
    }
    
    $amount = $input['orderDetails']['amount'] ?? 29;
    $commission = $amount * COMMISSION_RATE;
    
    // Get referrer by referral code
    $referrerStmt = $db->prepare("SELECT referral_code FROM referrers WHERE id = ? OR referral_code = ?");
    $referrerStmt->execute([$input['referrerId'], $input['referrerId']]);
    $referrer = $referrerStmt->fetch();
    
    if (!$referrer) {
        sendJSON(['error' => 'Referrer not found'], 404);
    }
    
    $referralCode = $referrer['referral_code'];
    $orderId = $input['orderDetails']['orderId'] ?? generateId();
    
    // Record conversion
    $stmt = $db->prepare("
        INSERT INTO referral_conversions (referral_id, order_id, amount, commission, status, timestamp)
        VALUES (?, ?, ?, ?, 'pending', NOW())
    ");
    
    $stmt->execute([$referralCode, $orderId, $amount, $commission]);
    
    sendJSON([
        'success' => true,
        'commission' => $commission,
        'message' => 'Conversion recorded'
    ]);
    
} catch (Exception $e) {
    error_log("Error recording conversion: " . $e->getMessage());
    sendJSON(['error' => 'Failed to record conversion'], 500);
}

?>

