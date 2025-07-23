<?php
/**
 * Router Test File
 */

// Define environment
define('ENVIRONMENT', 'development');

// Load bootstrap file
require_once __DIR__ . '/../app/bootstrap.php';

// Debug information
echo '<h1>Router Test</h1>';
echo '<pre>';
echo 'PHP Version: ' . phpversion() . "\n";
echo 'Document Root: ' . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo 'Request URI: ' . $_SERVER['REQUEST_URI'] . "\n";
echo 'Script Name: ' . $_SERVER['SCRIPT_NAME'] . "\n";

// Test autoloading
echo "\nTesting Autoloading:\n";
echo "Looking for ChatbotController...\n";

if (class_exists('ChatbotController')) {
    echo "ChatbotController class found!\n";
} else {
    echo "ChatbotController class NOT found!\n";
    
    // Try to include it manually
    echo "Trying to include manually...\n";
    $controllerPath = APP_PATH . '/controllers/ChatbotController.php';
    echo "Controller path: $controllerPath\n";
    
    if (file_exists($controllerPath)) {
        echo "File exists, including...\n";
        include_once $controllerPath;
        
        if (class_exists('ChatbotController')) {
            echo "ChatbotController class found after manual include!\n";
        } else {
            echo "ChatbotController class STILL NOT found after manual include!\n";
        }
    } else {
        echo "File does not exist!\n";
    }
}

echo '</pre>';