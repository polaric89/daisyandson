<?php
/**
 * GET /api/image/{filename}
 * Serve uploaded images via HTTP
 */

require_once __DIR__ . '/../config.php';

$filename = $_GET['filename'] ?? '';
if (empty($filename)) {
    http_response_code(400);
    echo 'Filename required';
    exit;
}

// Security: Only allow alphanumeric, dash, underscore, and dot
if (!preg_match('/^[a-zA-Z0-9._-]+$/', $filename)) {
    http_response_code(400);
    echo 'Invalid filename';
    exit;
}

$filePath = UPLOAD_DIR . $filename;

if (!file_exists($filePath)) {
    http_response_code(404);
    echo 'Image not found';
    exit;
}

// Get file extension to set correct content type
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$contentTypes = [
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'webp' => 'image/webp'
];

$contentType = $contentTypes[$ext] ?? 'image/png';

// Set headers
header('Content-Type: ' . $contentType);
header('Cache-Control: public, max-age=31536000');
header('Access-Control-Allow-Origin: *');

// Output file
readfile($filePath);
exit;

?>

