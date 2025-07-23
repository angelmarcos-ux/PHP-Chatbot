<?php
/**
 * Router for PHP built-in server
 * This file is used only with the PHP built-in server to route all requests to index.php
 */

// Get the requested URI
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Debug information
if (isset($_GET['debug'])) {
    echo '<pre>';
    echo 'Debug Information:\n';
    echo 'PHP Version: ' . phpversion() . '\n';
    echo 'Document Root: ' . $_SERVER['DOCUMENT_ROOT'] . '\n';
    echo 'Request URI: ' . $_SERVER['REQUEST_URI'] . '\n';
    echo 'Script Name: ' . $_SERVER['SCRIPT_NAME'] . '\n';
    echo 'URI: ' . $uri . '\n';
    echo '</pre>';
}

// Debug information
if (isset($_GET['debug'])) {
    echo '<pre>';
    echo 'Router Debug Information:\n';
    echo 'URI: ' . $uri . '\n';
    echo 'File Path: ' . __DIR__ . $uri . '\n';
    echo 'File Exists: ' . (file_exists(__DIR__ . $uri) ? 'Yes' : 'No') . '\n';
    echo 'index.php Exists: ' . (file_exists(__DIR__ . '/index.php') ? 'Yes' : 'No') . '\n';
    echo '</pre>';
}

// If the file exists, serve it directly
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// For the root URL or non-existent files, include the index.php file
include_once __DIR__ . '/index.php';