<?php
/**
 * GET /api/shipping/rates
 * Get available shipping rates (static fallback rates)
 */

require_once __DIR__ . '/../config.php';

$country = $_GET['country'] ?? 'AE';

// Static shipping rates (fallback)
$rates = [
    'AE' => [
        [
            'name' => 'Standard Shipping (UAE)',
            'price' => 15,
            'deliveryTime' => '3-5 business days',
            'carrier' => 'Aramex'
        ],
        [
            'name' => 'Express Shipping (UAE)',
            'price' => 30,
            'deliveryTime' => '1-2 business days',
            'carrier' => 'Aramex'
        ]
    ],
    'default' => [
        [
            'name' => 'International Standard',
            'price' => 45,
            'deliveryTime' => '7-14 business days',
            'carrier' => 'Aramex'
        ],
        [
            'name' => 'International Express',
            'price' => 80,
            'deliveryTime' => '3-5 business days',
            'carrier' => 'Aramex'
        ]
    ]
];

$countryRates = $rates[$country] ?? $rates['default'];

sendJSON([
    'country' => $country,
    'rates' => $countryRates
]);

?>

