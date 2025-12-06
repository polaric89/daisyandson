<?php
/**
 * GET /api/admin/payouts
 * Get all payout requests (admin endpoint)
 */

require_once __DIR__ . '/../config.php';

$db = getDB();

try {
    $status = $_GET['status'] ?? null;
    
    $sql = "
        SELECT p.*, r.name as referrer_name, r.email as referrer_email, r.referral_code
        FROM payouts p
        JOIN referrers r ON p.referrer_id = r.id
    ";
    
    if ($status) {
        $sql .= " WHERE p.status = ?";
    }
    
    $sql .= " ORDER BY p.requested_at DESC";
    
    $stmt = $status ? $db->prepare($sql) : $db->query($sql);
    
    if ($status) {
        $stmt->execute([$status]);
    }
    
    $payouts = [];
    while ($row = $stmt->fetch()) {
        $payouts[] = [
            'id' => $row['id'],
            'referrerId' => $row['referrer_id'],
            'referrerName' => $row['referrer_name'],
            'referrerEmail' => $row['referrer_email'],
            'referralCode' => $row['referral_code'],
            'amount' => (float)$row['amount'],
            'paymentMethod' => $row['payment_method'],
            'paymentDetails' => json_decode($row['payment_details'], true),
            'status' => $row['status'],
            'transactionId' => $row['transaction_id'],
            'requestedAt' => $row['requested_at'],
            'processedAt' => $row['processed_at']
        ];
    }
    
    sendJSON($payouts);
    
} catch (Exception $e) {
    error_log("Error getting payouts: " . $e->getMessage());
    sendJSON(['error' => 'Failed to get payouts'], 500);
}

?>

