<?php
/**
 * Front Controller
 * Entry point for all requests
 */

// Define environment
define('ENVIRONMENT', 'development'); // Change to 'production' for production

// Load bootstrap file
require_once __DIR__ . '/../app/bootstrap.php';

// Debug information for development only
if (false) {
    echo '<pre>';
    echo 'Debug Information:\n';
    echo 'PHP Version: ' . phpversion() . '\n';
    echo 'Document Root: ' . $_SERVER['DOCUMENT_ROOT'] . '\n';
    echo 'Request URI: ' . $_SERVER['REQUEST_URI'] . '\n';
    echo 'Script Name: ' . $_SERVER['SCRIPT_NAME'] . '\n';
    echo '</pre>';
}

// Load router
require_once APP_PATH . '/core/Router.php';

// Create router instance
$router = new Router();

// Define routes
$router->get('/', 'ChatbotController@index');
$router->post('/send-message', 'ChatbotController@sendMessage');
$router->post('/clear-chat', 'ChatbotController@clearChat');

// Set 404 handler
$router->setNotFound(function() {
    header('HTTP/1.1 404 Not Found');
    echo render_view('errors/404', [], 'default');
});

// Dispatch request
$router->dispatch();