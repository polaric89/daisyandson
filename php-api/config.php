<?php
/**
 * Database Configuration
 * Update these values for your local and production environments
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'badge_designer');
define('DB_USER', 'root'); // Change for production
define('DB_PASS', ''); // Change for production
define('DB_CHARSET', 'utf8mb4');

// Application configuration
define('BASE_URL', 'http://localhost/php-api'); // Change for production
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('COMMISSION_RATE', 0.10); // 10%

// CORS configuration
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://daisyandson.co',
    'http://daisyandson.co'
];

// Database connection
function getDB() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed']);
            exit;
        }
    }
    
    return $pdo;
}

// Helper function to send JSON response
function sendJSON($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Helper function to handle CORS
function handleCORS($allowed_origins) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // Allow all origins for development (remove in production)
        header("Access-Control-Allow-Origin: *");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Initialize CORS
handleCORS($allowed_origins);

// Create uploads directory if it doesn't exist
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

?>
