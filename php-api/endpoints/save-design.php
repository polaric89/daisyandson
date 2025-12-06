<?php
/**
 * POST /api/save-design
 * Saves badge design and order details
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$input = getJSONInput();
$db = getDB();

// Log incoming request
error_log("=== SAVE-DESIGN REQUEST ===");
error_log("Input keys: " . implode(', ', array_keys($input ?? [])));
error_log("Has payment data: " . (isset($input['payment']) ? 'YES' : 'NO'));
if (isset($input['payment'])) {
    $paymentKeys = is_array($input['payment']) ? array_keys($input['payment']) : [];
    error_log("Payment keys: " . implode(', ', $paymentKeys));
    if (isset($input['payment']['payerEmail'])) {
        error_log("Payer email in input: " . $input['payment']['payerEmail']);
    }
}

try {
    $orderId = generateId();
    $savedDesigns = [];
    
    // Handle multiple designs (new format)
    if (isset($input['designs']) && is_array($input['designs']) && count($input['designs']) > 0) {
        error_log("Processing " . count($input['designs']) . " designs for order: $orderId");
        foreach ($input['designs'] as $index => $design) {
            if (isset($design['image']) && !empty($design['image'])) {
                $fileName = $orderId . '-design-' . ($index + 1) . '.png';
                error_log("Attempting to save image: $fileName");
                
                // Always save the design, even if file saving fails
                $savedDesign = [
                    'id' => $design['id'] ?? ($index + 1),
                    'image' => $design['image'], // Keep base64 for preview
                    'imagePath' => null
                ];
                
                // Try to save to disk (optional - we still have base64)
                $saved = saveBase64Image($design['image'], $fileName);
                
                if ($saved) {
                    error_log("Image saved successfully to disk: $fileName");
                    $savedDesign['imagePath'] = '/uploads/' . $fileName;
                } else {
                    error_log("Failed to save image to disk: $fileName - but keeping base64 in database");
                }
                
                $savedDesigns[] = $savedDesign;
            } else {
                error_log("Design at index $index has no image property. Design keys: " . implode(', ', array_keys($design ?? [])));
            }
        }
    }
    // Handle single image (legacy format)
    elseif (isset($input['image'])) {
        $fileName = $orderId . '.png';
        $saved = saveBase64Image($input['image'], $fileName);
        
        if ($saved) {
            $savedDesigns[] = [
                'id' => 1,
                'image' => $input['image'],
                'imagePath' => '/uploads/' . $fileName
            ];
        }
    }
    
    if (empty($savedDesigns)) {
        error_log("No designs were successfully saved. Order ID: $orderId");
        sendJSON([
            'error' => 'No design images could be saved',
            'debug' => [
                'hasDesigns' => isset($input['designs']),
                'designsCount' => isset($input['designs']) ? count($input['designs']) : 0,
                'hasImage' => isset($input['image']),
                'uploadDir' => UPLOAD_DIR,
                'uploadDirExists' => file_exists(UPLOAD_DIR),
                'uploadDirWritable' => is_writable(UPLOAD_DIR)
            ]
        ], 400);
    }
    
    // Save order
    $stmt = $db->prepare("
        INSERT INTO orders (id, category, quantity, pricing, shipping, referral_id, status, buyer_info, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $category = $input['category'] ?? 'personal';
    $quantity = $input['quantity'] ?? count($savedDesigns);
    $pricing = json_encode($input['pricing'] ?? null);
    $shipping = json_encode($input['shipping'] ?? null);
    $referralId = $input['referralId'] ?? null;
    $status = $input['status'] ?? 'pending';
    $buyerInfo = json_encode($input['buyerInfo'] ?? null);
    
    $stmt->execute([$orderId, $category, $quantity, $pricing, $shipping, $referralId, $status, $buyerInfo]);
    
    error_log("Order saved with ID: $orderId");
    
    // Save payment data IMMEDIATELY after order is saved (before designs to ensure it's saved)
    if (isset($input['payment']) && !empty($input['payment'])) {
        $paymentId = generateId();
        $paymentData = json_encode($input['payment']);
        
        $paymentStmt = $db->prepare("
            INSERT INTO payments (id, order_id, payment_data, saved_at)
            VALUES (?, ?, ?, NOW())
        ");
        
        try {
            $paymentStmt->execute([$paymentId, $orderId, $paymentData]);
            error_log("Payment saved successfully for order: $orderId, payment ID: $paymentId");
            
            // Log payment email for debugging
            $paymentArray = is_array($input['payment']) ? $input['payment'] : json_decode($paymentData, true);
            $payerEmail = $paymentArray['payerEmail'] ?? $paymentArray['payer_email'] ?? 'not found';
            error_log("Payment email: $payerEmail for order: $orderId");
            
            // Verify it was actually saved
            $verifyStmt = $db->prepare("SELECT id FROM payments WHERE order_id = ? LIMIT 1");
            $verifyStmt->execute([$orderId]);
            $saved = $verifyStmt->fetch();
            if ($saved) {
                error_log("Payment verified in database for order: $orderId");
            } else {
                error_log("ERROR: Payment was NOT saved to database for order: $orderId");
            }
        } catch (Exception $e) {
            error_log("Error saving payment: " . $e->getMessage());
            error_log("Payment save error trace: " . $e->getTraceAsString());
            // Don't fail the order if payment save fails, but log it
        }
    } else {
        error_log("Warning: No payment data provided for order: $orderId");
        error_log("Input keys: " . implode(', ', array_keys($input ?? [])));
    }
    
    // Save designs
    $designStmt = $db->prepare("
        INSERT INTO designs (order_id, design_data, image_path)
        VALUES (?, ?, ?)
    ");
    
    foreach ($savedDesigns as $design) {
        // Ensure base64 image is present
        if (!isset($design['image']) || empty($design['image'])) {
            error_log("Warning: Design missing base64 image for order $orderId - skipping");
            continue;
        }
        
        $designData = json_encode($design);
        $imagePath = $design['imagePath'] ?? null;
        $base64Length = strlen($design['image']);
        error_log("Saving design to database - Order: $orderId, Image path: $imagePath, Base64 length: $base64Length chars");
        
        try {
            $designStmt->execute([$orderId, $designData, $imagePath]);
            error_log("Design saved successfully to database");
        } catch (Exception $e) {
            error_log("Error saving design to database: " . $e->getMessage());
            // Continue with next design even if one fails
        }
    }
    
    // If there's a referral, record conversion
    if ($referralId && isset($input['payment'])) {
        try {
            $amount = floatval($input['pricing']['total'] ?? $input['payment']['amount'] ?? 29);
            $commission = $amount * COMMISSION_RATE;
            
            error_log("Recording referral conversion - referralId: $referralId, orderId: $orderId, amount: $amount");
            
            // Get referrer by referral code (referralId should be the referral_code)
            $referrerStmt = $db->prepare("SELECT referral_code FROM referrers WHERE referral_code = ? OR id = ?");
            $referrerStmt->execute([$referralId, $referralId]);
            $referrer = $referrerStmt->fetch();
            
            if ($referrer) {
                $referralCode = $referrer['referral_code'];
                error_log("Found referrer with code: $referralCode, recording conversion");
                
                // Check if conversion already exists (avoid duplicates)
                $checkStmt = $db->prepare("SELECT id FROM referral_conversions WHERE order_id = ? AND referral_id = ?");
                $checkStmt->execute([$orderId, $referralCode]);
                $existing = $checkStmt->fetch();
                
                if (!$existing) {
                    $convStmt = $db->prepare("
                        INSERT INTO referral_conversions (referral_id, order_id, amount, commission, status, timestamp)
                        VALUES (?, ?, ?, ?, 'pending', NOW())
                    ");
                    $convStmt->execute([$referralCode, $orderId, $amount, $commission]);
                    error_log("Conversion recorded successfully - referral_id: $referralCode, order_id: $orderId");
                } else {
                    error_log("Conversion already exists for order $orderId and referral $referralCode");
                }
            } else {
                error_log("Referrer not found for referralId: $referralId - conversion not recorded");
            }
        } catch (Exception $e) {
            error_log("Error recording referral conversion: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            // Don't fail the order if referral conversion fails
        }
    } else {
        if (!$referralId) {
            error_log("No referralId provided - skipping conversion recording");
        }
        if (!isset($input['payment'])) {
            error_log("No payment data provided - skipping conversion recording");
        }
    }
    
    sendJSON([
        'success' => true,
        'orderId' => $orderId,
        'designCount' => count($savedDesigns),
        'message' => 'Order saved successfully'
    ]);
    
} catch (Exception $e) {
    error_log("Error saving design: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    sendJSON([
        'error' => 'Failed to save order',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ], 500);
}

?>
