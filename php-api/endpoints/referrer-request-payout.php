<?php
/**
 * POST /api/referrer/:id/request-payout
 * Request a payout
 * NOTE: Only earnings from COMPLETED orders are eligible for payout
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
    
    $amount = (float)($input['amount'] ?? 0);
    $paymentMethod = $input['paymentMethod'] ?? '';
    $paymentDetails = $input['paymentDetails'] ?? [];
    
    $MIN_PAYOUT = 50; // Minimum 50 AED
    
    // Get referrer
    $stmt = $db->prepare("SELECT * FROM referrers WHERE id = ?");
    $stmt->execute([$referrerId]);
    $referrer = $stmt->fetch();
    
    if (!$referrer) {
        sendJSON(['error' => 'Referrer not found'], 404);
    }
    
    // Calculate available balance - ONLY from completed orders
    $ordersStmt = $db->prepare("
        SELECT o.* 
        FROM orders o
        WHERE o.referral_id = ? AND o.status = 'completed'
    ");
    $ordersStmt->execute([$referrer['referral_code']]);
    $completedOrders = $ordersStmt->fetchAll();
    
    $confirmedEarnings = 0;
    foreach ($completedOrders as $order) {
        $pricing = json_decode($order['pricing'], true);
        $amountOrder = $pricing['total'] ?? 0;
        $confirmedEarnings += $amountOrder * COMMISSION_RATE;
    }
    
    // Get payouts
    $payoutsStmt = $db->prepare("SELECT * FROM payouts WHERE referrer_id = ?");
    $payoutsStmt->execute([$referrerId]);
    $payouts = $payoutsStmt->fetchAll();
    
    $paidAmount = 0;
    $pendingAmount = 0;
    foreach ($payouts as $payout) {
        if ($payout['status'] === 'paid') {
            $paidAmount += (float)$payout['amount'];
        } elseif ($payout['status'] === 'pending') {
            $pendingAmount += (float)$payout['amount'];
        }
    }
    
    $availableBalance = $confirmedEarnings - $paidAmount - $pendingAmount;
    
    if ($amount > $availableBalance) {
        sendJSON(['error' => "Insufficient balance. Available: " . number_format($availableBalance, 2) . " AED (only completed orders count)"], 400);
    }
    
    if ($amount < $MIN_PAYOUT) {
        sendJSON(['error' => "Minimum payout amount is {$MIN_PAYOUT} AED"], 400);
    }
    
    // Check for existing pending payout
    $hasPending = false;
    foreach ($payouts as $payout) {
        if ($payout['status'] === 'pending') {
            $hasPending = true;
            break;
        }
    }
    
    if ($hasPending) {
        sendJSON(['error' => 'You already have a pending payout request'], 400);
    }
    
    // Validate payment details
    if (empty($paymentMethod)) {
        sendJSON(['error' => 'Payment method is required'], 400);
    }
    
    if ($paymentMethod === 'paypal' && empty($paymentDetails['paypalEmail'])) {
        sendJSON(['error' => 'PayPal email is required'], 400);
    }
    
    if ($paymentMethod === 'bank' && (empty($paymentDetails['bankName']) || empty($paymentDetails['iban']))) {
        sendJSON(['error' => 'Bank details are required'], 400);
    }
    
    // Create payout request
    $payoutId = generateId();
    $transactionId = 'TXN' . time() . strtoupper(substr(md5(uniqid()), 0, 8));
    
    $insertStmt = $db->prepare("
        INSERT INTO payouts (id, referrer_id, amount, payment_method, payment_details, status, transaction_id, requested_at)
        VALUES (?, ?, ?, ?, ?, 'pending', ?, NOW())
    ");
    
    $paymentDetailsJson = json_encode($paymentDetails);
    $insertStmt->execute([$payoutId, $referrerId, $amount, $paymentMethod, $paymentDetailsJson, $transactionId]);
    
    sendJSON([
        'success' => true,
        'payoutId' => $payoutId,
        'transactionId' => $transactionId,
        'message' => 'Payout request submitted successfully'
    ]);
    
} catch (Exception $e) {
    error_log("Error requesting payout: " . $e->getMessage());
    sendJSON(['error' => 'Failed to request payout'], 500);
}

?>

