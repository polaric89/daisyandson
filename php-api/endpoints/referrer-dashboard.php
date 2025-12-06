<?php
/**
 * GET /api/referrer/:id/dashboard
 * Get full referrer dashboard data
 * NOTE: Earnings only count when order status is 'completed'
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$referrerId = getRouteParam('id');
$db = getDB();

try {
    if (empty($referrerId)) {
        sendJSON(['error' => 'Referrer ID is required'], 400);
    }
    
    error_log("Dashboard request - Looking for referrer ID: " . $referrerId);
    error_log("Request path: " . $_SERVER['REQUEST_URI']);
    error_log("Route params: " . json_encode($_GET));
    
    // Get referrer by ID
    $stmt = $db->prepare("SELECT * FROM referrers WHERE id = ?");
    $stmt->execute([$referrerId]);
    $referrer = $stmt->fetch();
    
    if (!$referrer) {
        error_log("Referrer not found with ID: " . $referrerId);
        
        // Debug: Show all referrers in database
        $checkStmt = $db->query("SELECT id, email, referral_code FROM referrers LIMIT 10");
        $allReferrers = $checkStmt->fetchAll();
        error_log("Total referrers in database: " . count($allReferrers));
        error_log("Available referrers: " . json_encode($allReferrers));
        
        // Try to find by referral code (in case frontend is passing wrong ID)
        if (strpos($referrerId, 'REF') === 0) {
            $codeStmt = $db->prepare("SELECT * FROM referrers WHERE referral_code = ?");
            $codeStmt->execute([$referrerId]);
            $referrer = $codeStmt->fetch();
            if ($referrer) {
                error_log("Found referrer by referral code instead of ID");
            }
        }
        
        if (!$referrer) {
            sendJSON([
                'error' => 'Referrer not found',
                'debug' => [
                    'requestedId' => $referrerId,
                    'totalReferrers' => count($allReferrers)
                ]
            ], 404);
        }
    }
    
    error_log("Referrer found: " . $referrer['email'] . " (ID: " . $referrer['id'] . ")");
    
    // Get referral stats
    $clicksStmt = $db->prepare("SELECT COUNT(*) as count FROM referral_clicks WHERE referral_id = ?");
    $clicksStmt->execute([$referrer['referral_code']]);
    $clicks = (int)$clicksStmt->fetch()['count'];
    
    // Get orders from referrals - ONLY completed orders count for earnings
    $ordersStmt = $db->prepare("
        SELECT o.*, 
               SUM(rc.amount) as total_amount,
               SUM(rc.commission) as total_commission
        FROM orders o
        LEFT JOIN referral_conversions rc ON o.id = rc.order_id AND rc.referral_id = ?
        WHERE o.referral_id = ?
        GROUP BY o.id
    ");
    $ordersStmt->execute([$referrer['referral_code'], $referrer['referral_code']]);
    $referredOrders = $ordersStmt->fetchAll();
    
    // Calculate earnings - ONLY from completed orders
    $completedOrders = array_filter($referredOrders, function($o) {
        return $o['status'] === 'completed';
    });
    $pendingOrders = array_filter($referredOrders, function($o) {
        return $o['status'] !== 'completed';
    });
    
    $confirmedEarnings = 0;
    foreach ($completedOrders as $order) {
        $pricing = json_decode($order['pricing'], true);
        $amount = $pricing['total'] ?? 0;
        $confirmedEarnings += $amount * COMMISSION_RATE;
    }
    
    $pendingConfirmation = 0;
    foreach ($pendingOrders as $order) {
        $pricing = json_decode($order['pricing'], true);
        $amount = $pricing['total'] ?? 0;
        $pendingConfirmation += $amount * COMMISSION_RATE;
    }
    
    // Get payouts
    $payoutsStmt = $db->prepare("SELECT * FROM payouts WHERE referrer_id = ? ORDER BY requested_at DESC");
    $payoutsStmt->execute([$referrerId]);
    $payouts = $payoutsStmt->fetchAll();
    
    $paidAmount = 0;
    $pendingPayoutAmount = 0;
    foreach ($payouts as $payout) {
        if ($payout['status'] === 'paid') {
            $paidAmount += (float)$payout['amount'];
        } elseif ($payout['status'] === 'pending') {
            $pendingPayoutAmount += (float)$payout['amount'];
        }
    }
    
    // Available for payout = confirmed earnings - already paid - pending payout requests
    $availableForPayout = max(0, $confirmedEarnings - $paidAmount - $pendingPayoutAmount);
    
    // Get recent conversions (last 20)
    $conversionsStmt = $db->prepare("
        SELECT rc.*, o.status as order_status, o.pricing
        FROM referral_conversions rc
        JOIN orders o ON rc.order_id = o.id
        WHERE rc.referral_id = ?
        ORDER BY rc.timestamp DESC
        LIMIT 20
    ");
    $conversionsStmt->execute([$referrer['referral_code']]);
    $conversions = [];
    while ($conv = $conversionsStmt->fetch()) {
        $orderPricing = json_decode($conv['pricing'], true);
        $conversions[] = [
            'orderId' => $conv['order_id'],
            'amount' => (float)$conv['amount'],
            'commission' => (float)$conv['commission'],
            'status' => $conv['order_status'] === 'completed' ? 'completed' : 'pending',
            'timestamp' => $conv['timestamp']
        ];
    }
    
    // Format payouts for frontend
    $formattedPayouts = [];
    foreach ($payouts as $payout) {
        $formattedPayouts[] = [
            'id' => $payout['id'],
            'amount' => (float)$payout['amount'],
            'status' => $payout['status'],
            'paymentMethod' => json_decode($payout['payment_details'], true)['paymentMethod'] ?? 'unknown',
            'requestedAt' => $payout['requested_at'],
            'processedAt' => $payout['processed_at']
        ];
    }
    
    sendJSON([
        'referrer' => [
            'id' => $referrer['id'],
            'referralCode' => $referrer['referral_code'],
            'name' => $referrer['name'],
            'email' => $referrer['email']
        ],
        'stats' => [
            'totalClicks' => $clicks,
            'clicks' => $clicks,
            'totalConversions' => count($referredOrders),
            'conversions' => count($completedOrders),
            'completedConversions' => count($completedOrders),
            'confirmedEarnings' => round($confirmedEarnings, 2),
            'pendingConfirmation' => round($pendingConfirmation, 2),
            'availableForPayout' => round($availableForPayout, 2),
            'pendingEarnings' => round($availableForPayout, 2), // Frontend expects this name
            'paidAmount' => round($paidAmount, 2),
            'paidEarnings' => round($paidAmount, 2),
            'pendingPayoutAmount' => round($pendingPayoutAmount, 2)
        ],
        'recentConversions' => $conversions,
        'payouts' => $formattedPayouts
    ]);
    
} catch (Exception $e) {
    error_log("Error getting dashboard: " . $e->getMessage());
    sendJSON(['error' => 'Failed to get dashboard data'], 500);
}

?>

