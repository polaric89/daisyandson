<?php
/**
 * GET /api/referral/{code} or /r/{code}
 * Redirect endpoint for referral links
 * Provides a clean, direct redirect without interstitial pages
 */

require_once __DIR__ . '/../config.php';

// Get referral code from URL parameter (could be 'code' or from route)
$referralCode = $_GET['code'] ?? '';

if (empty($referralCode)) {
    // If no code, redirect to home
    header('Location: /');
    exit;
}

// Validate referral code exists in database
try {
    $db = getDB();
    $stmt = $db->prepare("SELECT id, referral_code, status FROM referrers WHERE referral_code = ? AND status = 'active'");
    $stmt->execute([$referralCode]);
    $referrer = $stmt->fetch();
    
    if (!$referrer) {
        // Invalid referral code, redirect to home
        header('Location: /');
        exit;
    }
    
    // Track the click (using existing schema)
    try {
        $trackStmt = $db->prepare("
            INSERT INTO referral_clicks (referral_id, ip_address, source, timestamp)
            VALUES (?, ?, ?, NOW())
        ");
        $trackStmt->execute([
            $referralCode,
            $_SERVER['REMOTE_ADDR'] ?? '',
            $_SERVER['HTTP_REFERER'] ?? 'direct'
        ]);
    } catch (Exception $e) {
        // Log error but don't fail the redirect
        error_log("Failed to track referral click: " . $e->getMessage());
    }
    
    // Redirect to home page with referral parameter
    // The frontend will pick up the ?ref= parameter and track it
    $redirectUrl = '/?ref=' . urlencode($referralCode);
    header('Location: ' . $redirectUrl, true, 302);
    exit;
    
} catch (Exception $e) {
    error_log("Referral redirect error: " . $e->getMessage());
    // On error, just redirect to home
    header('Location: /');
    exit;
}

?>

