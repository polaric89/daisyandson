<?php
/**
 * GET /api/designs
 * Get all saved designs (admin endpoint)
 */

require_once __DIR__ . '/../config.php';

$db = getDB();

try {
    $stmt = $db->query("
        SELECT d.*, o.category, o.status, o.timestamp as order_timestamp
        FROM designs d
        JOIN orders o ON d.order_id = o.id
        ORDER BY d.created_at DESC
    ");
    
    $designs = [];
    while ($row = $stmt->fetch()) {
        $designs[] = [
            'id' => $row['id'],
            'orderId' => $row['order_id'],
            'designData' => json_decode($row['design_data'], true),
            'imagePath' => $row['image_path'],
            'category' => $row['category'],
            'orderStatus' => $row['status'],
            'createdAt' => $row['created_at'],
            'orderTimestamp' => $row['order_timestamp']
        ];
    }
    
    sendJSON($designs);
    
} catch (Exception $e) {
    error_log("Error getting designs: " . $e->getMessage());
    sendJSON(['error' => 'Failed to get designs'], 500);
}

?>

