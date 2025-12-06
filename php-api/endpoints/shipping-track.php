<?php
/**
 * GET /api/shipping/track/:id
 * Track shipment by tracking number
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$trackingNumber = getRouteParam('id');

// Placeholder for Aramex tracking integration
// For now, return mock tracking info

sendJSON([
    'trackingNumber' => $trackingNumber,
    'status' => 'In Transit',
    'currentLocation' => 'Dubai, UAE',
    'estimatedDelivery' => date('Y-m-d', strtotime('+3 days')),
    'history' => [
        [
            'date' => date('Y-m-d H:i:s'),
            'location' => 'Dubai, UAE',
            'status' => 'Shipment received'
        ]
    ],
    'note' => 'Aramex tracking integration pending'
]);

?>

