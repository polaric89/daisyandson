<?php
/**
 * POST /api/shipping/create
 * Create a shipment (placeholder - integrate with Aramex API later)
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$input = getJSONInput();

// Placeholder for Aramex integration
// For now, return a mock tracking number

$trackingNumber = 'ARX' . time() . strtoupper(substr(md5(uniqid()), 0, 8));

sendJSON([
    'success' => true,
    'trackingNumber' => $trackingNumber,
    'message' => 'Shipment created (mock)',
    'note' => 'Aramex integration pending'
]);

?>

