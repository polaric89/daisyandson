<?php
/**
 * Helper Functions
 */

require_once __DIR__ . '/config.php';

/**
 * Generate unique ID
 */
function generateId() {
    return time() . '-' . substr(md5(uniqid(rand(), true)), 0, 9);
}

/**
 * Save base64 image to file
 */
function saveBase64Image($base64Data, $fileName) {
    try {
        $uploadDir = UPLOAD_DIR;
        
        // Remove data URL prefix if present
        $base64Data = preg_replace('/^data:image\/\w+;base64,/', '', $base64Data);
        
        if (empty($base64Data)) {
            error_log("saveBase64Image: Empty base64 data after removing prefix");
            return false;
        }
        
        // Decode base64
        $imageData = base64_decode($base64Data, true); // strict mode
        
        if ($imageData === false) {
            error_log("saveBase64Image: Failed to decode base64 data for file: $fileName");
            return false;
        }
        
        // Create upload directory if it doesn't exist
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                error_log("saveBase64Image: Failed to create upload directory: $uploadDir");
                return false;
            }
        }
        
        // Check if directory is writable
        if (!is_writable($uploadDir)) {
            error_log("saveBase64Image: Upload directory is not writable: $uploadDir");
            return false;
        }
        
        // Save file
        $filePath = $uploadDir . $fileName;
        $bytesWritten = file_put_contents($filePath, $imageData);
        
        if ($bytesWritten === false) {
            error_log("saveBase64Image: Failed to write file: $filePath");
            return false;
        }
        
        error_log("saveBase64Image: Successfully saved $bytesWritten bytes to: $filePath");
        return $fileName;
        
    } catch (Exception $e) {
        error_log("saveBase64Image: Exception occurred: " . $e->getMessage());
        return false;
    }
}

/**
 * Get JSON request body
 */
function getJSONInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

/**
 * Get route parameter
 */
function getRouteParam($name) {
    return $_GET[$name] ?? null;
}

/**
 * Save uploaded file
 */
function saveUploadedFile($file, $prefix = 'file') {
    try {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            error_log("File upload error: " . $file['error']);
            return false;
        }
        
        $uploadDir = UPLOAD_DIR;
        
        // Create upload directory if it doesn't exist
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                error_log("Failed to create upload directory: $uploadDir");
                return false;
            }
        }
        
        // Generate unique filename
        $fileExt = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = $prefix . '-' . time() . '-' . substr(md5(uniqid()), 0, 8) . '.' . $fileExt;
        $filePath = $uploadDir . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            return $fileName;
        } else {
            error_log("Failed to move uploaded file");
            return false;
        }
    } catch (Exception $e) {
        error_log("Error saving uploaded file: " . $e->getMessage());
        return false;
    }
}

?>
