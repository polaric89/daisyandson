<?php
/**
 * POST /api/referrer/register
 * Register as a new referrer
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$input = getJSONInput();
$db = getDB();

try {
    if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
        sendJSON(['error' => 'Name, email, and password are required'], 400);
    }
    
    if (strlen($input['password']) < 6) {
        sendJSON(['error' => 'Password must be at least 6 characters'], 400);
    }
    
    // Validate email
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        sendJSON(['error' => 'Invalid email format'], 400);
    }
    
    // Check if email already exists
    $checkStmt = $db->prepare("SELECT id FROM referrers WHERE email = ?");
    $checkStmt->execute([strtolower($input['email'])]);
    if ($checkStmt->fetch()) {
        sendJSON(['error' => 'Email already registered. Please login instead.'], 400);
    }
    
    // Generate referral code
    $referralCode = 'REF' . strtoupper(base_convert(time(), 10, 36)) . strtoupper(substr(md5(uniqid()), 0, 5));
    
    // Hash password (using password_hash for better security)
    $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);
    
    // Insert referrer
    $stmt = $db->prepare("
        INSERT INTO referrers (id, referral_code, name, email, phone, password_hash, status, registered_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())
    ");
    
    $id = generateId();
    $stmt->execute([
        $id,
        $referralCode,
        $input['name'],
        strtolower($input['email']),
        $input['phone'] ?? '',
        $passwordHash
    ]);
    
    // Verify the referrer was actually inserted
    $verifyStmt = $db->prepare("SELECT * FROM referrers WHERE id = ?");
    $verifyStmt->execute([$id]);
    $verified = $verifyStmt->fetch();
    
    if (!$verified) {
        error_log("ERROR: Referrer registration failed - ID not found after insert: " . $id);
        sendJSON(['error' => 'Registration failed - please try again'], 500);
    }
    
    error_log("Referrer registered successfully: " . $input['email'] . " (ID: " . $id . ")");
    
    sendJSON([
        'success' => true,
        'referrer' => [
            'id' => $id,
            'referralCode' => $referralCode,
            'name' => $input['name'],
            'email' => strtolower($input['email'])
        ],
        'message' => 'Registration successful! You can now share your referral link.'
    ]);
    
} catch (Exception $e) {
    error_log("Error registering referrer: " . $e->getMessage());
    sendJSON(['error' => 'Failed to register referrer'], 500);
}

?>
