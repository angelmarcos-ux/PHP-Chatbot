<?php
/**
 * Application Bootstrap File
 * Initializes the application environment and core components
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Load configuration
$config = require_once __DIR__ . '/config/config.php';

// Initialize chat history if not exists
if (!isset($_SESSION['chat_history'])) {
    $_SESSION['chat_history'] = [];
}

// Initialize rate limiting if not exists
if (!isset($_SESSION['rate_limit'])) {
    $_SESSION['rate_limit'] = [
        'count' => 0,
        'window_start' => time()
    ];
}

// Error handling
function handleError($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) {
        // This error code is not included in error_reporting
        return false;
    }

    $error_message = "Error: [$errno] $errstr - $errfile:$errline";
    error_log($error_message);
    
    // For API requests, return JSON error
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'An internal error occurred. Please try again.']);
        exit;
    }
    
    // For regular requests, show error in development, generic message in production
    if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
        echo "<div style='color:red;'>$error_message</div>";
    } else {
        echo "<div>Sorry, something went wrong. Please try again later.</div>";
    }
    
    return true; // Don't execute PHP internal error handler
}

// Set error handler
set_error_handler('handleError');

// Autoload classes (simple implementation)
function autoload($className) {
    // Check for controller classes first
    if (substr($className, -10) === 'Controller') {
        $controllerFile = APP_PATH . '/controllers/' . $className . '.php';
        if (file_exists($controllerFile)) {
            require_once $controllerFile;
            return true;
        }
    }
    
    // Debug autoloading
    if (isset($_GET['debug'])) {
        error_log("Trying to autoload: $className");
        error_log("Controller file path: " . APP_PATH . '/controllers/' . $className . '.php');
    }
    
    // Convert namespace to file path
    $className = str_replace('\\', DIRECTORY_SEPARATOR, $className);
    $file = __DIR__ . DIRECTORY_SEPARATOR . $className . '.php';
    
    if (file_exists($file)) {
        require_once $file;
        return true;
    }
    return false;
}

spl_autoload_register('autoload');

// Helper functions
require_once __DIR__ . '/helpers/functions.php';