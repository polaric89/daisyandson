<?php
/**
 * POST /api/track-referral
 * Tracks referral link clicks
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$input = getJSONInput();
$db = getDB();

try {
    if (empty($input['referralId'])) {
        sendJSON(['error' => 'No referral ID provided'], 400);
    }
    
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $source = $input['source'] ?? 'unknown';
    
    $stmt = $db->prepare("
        INSERT INTO referral_clicks (referral_id, ip_address, source, timestamp)
        VALUES (?, ?, ?, NOW())
    ");
    
    $stmt->execute([$input['referralId'], $ipAddress, $source]);
    
    sendJSON([
        'success' => true,
        'message' => 'Referral click tracked'
    ]);
    
} catch (Exception $e) {
    error_log("Error tracking referral: " . $e->getMessage());
    sendJSON(['error' => 'Failed to track referral'], 500);
}

?>

