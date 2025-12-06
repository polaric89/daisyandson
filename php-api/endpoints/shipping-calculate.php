<?php
/**
 * POST /api/shipping/calculate
 * Calculate shipping cost
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../helpers.php';

$input = getJSONInput();

$country = $input['country'] ?? 'AE';
$weight = $input['weight'] ?? 0.5; // kg

// Simple calculation (can be enhanced with Aramex API)
$baseRates = [
    'AE' => ['standard' => 15, 'express' => 30],
    'default' => ['standard' => 45, 'express' => 80]
];

$rates = $baseRates[$country] ?? $baseRates['default'];

sendJSON([
    'country' => $country,
    'weight' => $weight,
    'rates' => [
        [
            'name' => 'Standard Shipping',
            'price' => $rates['standard'],
            'deliveryTime' => $country === 'AE' ? '3-5 business days' : '7-14 business days'
        ],
        [
            'name' => 'Express Shipping',
            'price' => $rates['express'],
            'deliveryTime' => $country === 'AE' ? '1-2 business days' : '3-5 business days'
        ]
    ]
]);

?>

