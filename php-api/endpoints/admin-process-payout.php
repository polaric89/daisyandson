<?php
/**
 * PUT /api/admin/payouts/:id
 * Process a payout request (mark as paid or reject)
 * Supports file upload for proof of payment
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$payoutId = getRouteParam('id');
$db = getDB();

try {
    if (empty($payoutId)) {
        sendJSON(['error' => 'Payout ID is required'], 400);
    }
    
    // Handle multipart/form-data (for file uploads)
    // For PUT requests, $_POST might be empty, so check both $_POST and parse manually
    $action = $_POST['action'] ?? '';
    $status = $_POST['status'] ?? '';
    $adminNotes = $_POST['adminNotes'] ?? '';
    $transactionNumber = $_POST['transactionNumber'] ?? '';
    $proofText = $_POST['proofText'] ?? '';
    
    // If $_POST is empty (PUT request), try to get from request
    if (empty($action) && empty($status)) {
        // For PUT requests with FormData, we need to parse differently
        // Check if it's a multipart request
        if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
            // For multipart, $_POST should work, but if not, try parsing
            parse_str(file_get_contents('php://input'), $putData);
            if (!empty($putData)) {
                $action = $putData['action'] ?? $action;
                $status = $putData['status'] ?? $status;
                $adminNotes = $putData['adminNotes'] ?? $adminNotes;
                $transactionNumber = $putData['transactionNumber'] ?? $transactionNumber;
                $proofText = $putData['proofText'] ?? $proofText;
            }
        }
    }
    
    // Log for debugging
    error_log("Processing payout - Action: $action, Status: $status, POST: " . json_encode($_POST));
    
    // If status is provided, convert to action
    if (!empty($status)) {
        if ($status === 'paid') {
            $action = 'approve';
        } elseif ($status === 'rejected') {
            $action = 'reject';
        }
    }
    
    if (empty($action) || !in_array($action, ['approve', 'reject'])) {
        error_log("Invalid action received - Action: '$action', Status: '$status'");
        sendJSON(['error' => 'Invalid action. Use "approve" or "reject", or status "paid" or "rejected". Received: action=' . $action . ', status=' . $status], 400);
    }
    
    // Get payout
    $stmt = $db->prepare("SELECT * FROM payouts WHERE id = ?");
    $stmt->execute([$payoutId]);
    $payout = $stmt->fetch();
    
    if (!$payout) {
        sendJSON(['error' => 'Payout not found'], 404);
    }
    
    if ($payout['status'] !== 'pending') {
        sendJSON(['error' => 'Payout has already been processed'], 400);
    }
    
    // Handle proof of payment file upload (only for paid status)
    $proofOfPayment = null;
    if ($action === 'approve') {
        $proofData = [
            'type' => 'none',
            'uploadedAt' => date('Y-m-d H:i:s')
        ];
        
        // Handle file upload
        if (isset($_FILES['proofFile']) && $_FILES['proofFile']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['proofFile'];
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            $maxSize = 5 * 1024 * 1024; // 5MB
            
            if (!in_array($file['type'], $allowedTypes)) {
                sendJSON(['error' => 'Invalid file type. Only images (JPG, PNG, GIF) and PDF are allowed'], 400);
            }
            
            if ($file['size'] > $maxSize) {
                sendJSON(['error' => 'File size exceeds 5MB limit'], 400);
            }
            
            // Generate unique filename
            $fileExt = pathinfo($file['name'], PATHINFO_EXTENSION);
            $fileName = 'payout-proof-' . $payoutId . '-' . time() . '.' . $fileExt;
            $filePath = UPLOAD_DIR . $fileName;
            
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                $proofData['type'] = 'file';
                $proofData['filePath'] = '/uploads/' . $fileName;
                $proofData['fileName'] = $file['name'];
                $proofData['fileType'] = $file['type'];
                $proofData['fileSize'] = $file['size'];
            } else {
                error_log("Failed to move uploaded file: " . $file['tmp_name'] . " to " . $filePath);
                sendJSON(['error' => 'Failed to save proof of payment file'], 500);
            }
        }
        
        // Add text proof (for bank transfers)
        if (!empty($proofText)) {
            $proofData['type'] = $proofData['type'] === 'file' ? 'file_and_text' : 'text';
            $proofData['text'] = $proofText;
        }
        
        // Add transaction number
        if (!empty($transactionNumber)) {
            $proofData['transactionNumber'] = $transactionNumber;
        }
        
        $proofOfPayment = json_encode($proofData);
    }
    
    // Update payout status
    $newStatus = $action === 'approve' ? 'paid' : 'rejected';
    
    if ($proofOfPayment) {
        // Update with proof of payment
        $updateStmt = $db->prepare("
            UPDATE payouts 
            SET status = ?, 
                processed_at = NOW(),
                transaction_number = ?,
                proof_of_payment = ?
            WHERE id = ?
        ");
        $updateStmt->execute([$newStatus, $transactionNumber ?: null, $proofOfPayment, $payoutId]);
    } else {
        // Update without proof (for rejections)
        $updateStmt = $db->prepare("
            UPDATE payouts 
            SET status = ?, 
                processed_at = NOW()
            WHERE id = ?
        ");
        $updateStmt->execute([$newStatus, $payoutId]);
    }
    
    error_log("Payout $payoutId updated to status: $newStatus");
    
    sendJSON([
        'success' => true,
        'message' => "Payout {$action}d successfully",
        'payout' => [
            'id' => $payoutId,
            'status' => $newStatus
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error processing payout: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    sendJSON(['error' => 'Failed to process payout: ' . $e->getMessage()], 500);
}

?>

