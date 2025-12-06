<?php
/**
 * Badge Designer API - Main Router
 * Routes requests to appropriate endpoint files
 */

require_once __DIR__ . '/config.php';

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Remove base path if needed (for subdirectory installations)
$basePath = '/php-api';
if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}

// Remove trailing slash
$path = rtrim($path, '/');

// Debug logging
error_log("Router - Method: $method, Path: $path, Full URI: $uri");

// Route mapping
$routes = [
    // Health check
    'GET:/api/health' => 'health.php',
    'GET:/' => 'health.php',
    
    // Orders/Designs
    'POST:/api/save-design' => 'save-design.php',
    'GET:/api/designs' => 'get-designs.php',
    'GET:/api/orders' => 'get-orders.php',
    'GET:/api/orders/track/{id}' => 'track-order.php',
    'GET:/api/orders/track-by-email/{email}' => 'track-order-by-email.php',
    'PATCH:/api/orders/{id}/status' => 'update-order-status.php',
    'DELETE:/api/orders/{id}' => 'delete-order.php',
    
    // Payments
    'POST:/api/save-payment' => 'save-payment.php',
    
    // Referrals
    'POST:/api/track-referral' => 'track-referral.php',
    'POST:/api/record-conversion' => 'record-conversion.php',
    'GET:/api/referral-stats/{id}' => 'referral-stats.php',
    
    // Referrer system
    'POST:/api/referrer/register' => 'referrer-register.php',
    'POST:/api/referrer/login' => 'referrer-login.php',
    'GET:/api/referrer/{id}/dashboard' => 'referrer-dashboard.php',
    'POST:/api/referrer/{id}/request-payout' => 'referrer-request-payout.php',
    'PUT:/api/referrer/{id}/payment-details' => 'referrer-update-payment.php',
    
    // Admin
    'GET:/api/admin/referrers' => 'admin-referrers.php',
    'GET:/api/admin/payouts' => 'admin-payouts.php',
    'PUT:/api/admin/payouts/{id}' => 'admin-process-payout.php',
    
    // Shipping
    'GET:/api/shipping/rates' => 'shipping-rates.php',
    'GET:/api/shipping/rate/{country}' => 'shipping-rate.php',
    'POST:/api/shipping/calculate' => 'shipping-calculate.php',
    'POST:/api/shipping/create' => 'shipping-create.php',
    'GET:/api/shipping/track/{id}' => 'shipping-track.php',
    
    // Images
    'GET:/api/image' => 'get-image.php',
];

// Find matching route
$matched = false;
foreach ($routes as $route => $file) {
    // Handle parameter routes
    if (strpos($route, '{') !== false) {
        // Extract method from route (e.g., "GET:" from "GET:/api/referrer/{id}/dashboard")
        $routeMethod = substr($route, 0, strpos($route, ':'));
        $routePath = substr($route, strpos($route, ':') + 1);
        
        // Check if method matches
        if ($method === $routeMethod) {
            // Create pattern for matching (replace {id} with regex)
            $pattern = '#^' . preg_replace('/\{[^}]+\}/', '([^/]+)', $routePath) . '$#';
            
            if (preg_match($pattern, $path, $matches)) {
                array_shift($matches); // Remove full match
                // Store route parameters in $_GET for endpoint access
                $paramNames = [];
                preg_match_all('/\{([^}]+)\}/', $routePath, $paramNames);
                foreach ($paramNames[1] as $index => $name) {
                    // URL decode the parameter value
                    $_GET[$name] = isset($matches[$index]) ? urldecode($matches[$index]) : null;
                }
                error_log("Route matched: $route -> $file, params: " . json_encode($_GET));
                require __DIR__ . '/endpoints/' . $file;
                $matched = true;
                break;
            }
        }
    } else {
        // Exact route match
        $routeMethod = substr($route, 0, strpos($route, ':'));
        $routePath = substr($route, strpos($route, ':') + 1);
        
        if ($method === $routeMethod && $path === $routePath) {
            require __DIR__ . '/endpoints/' . $file;
            $matched = true;
            break;
        }
    }
}

// 404 if no route matched
if (!$matched) {
    http_response_code(404);
    sendJSON(['error' => 'Endpoint not found'], 404);
}

?>
