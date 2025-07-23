<?php
/**
 * Configuration file for Chatbot API settings
 * Store sensitive information securely
 */

// API Configuration
// IMPORTANT: Replace with your actual DeepSeek API key
define('DEEPSEEK_API_KEY', '');
define('DEEPSEEK_API_URL', 'https://api.deepseek.com/v1/chat/completions');
define('DEEPSEEK_MODEL', 'deepseek-chat');

// API Settings
define('API_TIMEOUT', 30); // seconds
define('MAX_TOKENS', 1000);
define('TEMPERATURE', 0.7);

// Rate limiting (simple implementation)
define('RATE_LIMIT_REQUESTS', 10); // requests per minute
define('RATE_LIMIT_WINDOW', 60); // seconds

// Application paths
define('BASE_PATH', dirname(__DIR__, 2));
define('APP_PATH', BASE_PATH . '/app');
define('PUBLIC_PATH', BASE_PATH . '/public');
define('VIEWS_PATH', APP_PATH . '/views');

// URL settings
define('BASE_URL', '/'); // Update this for production