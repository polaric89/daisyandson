<?php
/**
 * GET /api/health
 * Health check endpoint
 */

require_once __DIR__ . '/../config.php';

try {
    // Test database connection
    $db = getDB();
    
    sendJSON([
        'status' => 'ok',
        'timestamp' => date('c'),
        'database' => 'connected'
    ]);
} catch (Exception $e) {
    sendJSON([
        'status' => 'error',
        'message' => 'Database connection failed'
    ], 500);
}

?>
