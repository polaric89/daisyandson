<?php
/**
 * GET /api/shipping/rate/{country}
 * Get shipping rate for a specific country (returns default/standard rate)
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

// Get country from route parameter
$country = getRouteParam('country') ?? $_GET['country'] ?? 'AE';

// Static shipping rates (fallback)
$rates = [
    'AE' => [
        'name' => 'Standard Shipping (UAE)',
        'price' => 15,
        'deliveryTime' => '3-5 business days',
        'carrier' => 'Aramex',
        'currency' => 'AED'
    ],
    'SA' => [
        'name' => 'GCC Standard',
        'price' => 35,
        'deliveryTime' => '5-7 business days',
        'carrier' => 'Aramex',
        'currency' => 'AED'
    ],
    'KW' => [
        'name' => 'GCC Standard',
        'price' => 35,
        'deliveryTime' => '5-7 business days',
        'carrier' => 'Aramex',
        'currency' => 'AED'
    ],
    'BH' => [
        'name' => 'GCC Standard',
        'price' => 35,
        'deliveryTime' => '5-7 business days',
        'carrier' => 'Aramex',
        'currency' => 'AED'
    ],
    'QA' => [
        'name' => 'GCC Standard',
        'price' => 35,
        'deliveryTime' => '5-7 business days',
        'carrier' => 'Aramex',
        'currency' => 'AED'
    ],
    'OM' => [
        'name' => 'GCC Standard',
        'price' => 35,
        'deliveryTime' => '5-7 business days',
        'carrier' => 'Aramex',
        'currency' => 'AED'
    ],
    'default' => [
        'name' => 'International Standard',
        'price' => 45,
        'deliveryTime' => '7-14 business days',
        'carrier' => 'Aramex',
        'currency' => 'AED'
    ]
];

// Get rate for country or use default
$rate = $rates[$country] ?? $rates['default'];

sendJSON($rate);

?>

