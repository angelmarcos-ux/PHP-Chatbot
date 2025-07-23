<?php
/**
 * Helper Functions
 * Common utility functions used throughout the application
 */

/**
 * Sanitize output to prevent XSS
 * @param string $text Text to sanitize
 * @return string Sanitized text
 */
function sanitize_output($text) {
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

/**
 * Get current time formatted for display
 * @return string Formatted time (e.g., "10:30 AM")
 */
function get_formatted_time() {
    return date('g:i A');
}

/**
 * Check if the request is an AJAX request
 * @return bool True if AJAX request, false otherwise
 */
function is_ajax_request() {
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

/**
 * Get a random item from an array
 * @param array $array The input array
 * @return mixed Random item from the array
 */
function get_random_item($array) {
    if (empty($array)) {
        return null;
    }
    return $array[array_rand($array)];
}

/**
 * Check if a string matches any pattern in an array of patterns
 * @param string $text Text to check
 * @param array $patterns Array of regex patterns
 * @return bool True if matches any pattern, false otherwise
 */
function matches_patterns($text, $patterns) {
    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $text)) {
            return true;
        }
    }
    return false;
}

/**
 * Redirect to a URL
 * @param string $url URL to redirect to
 * @param int $status HTTP status code
 */
function redirect($url, $status = 302) {
    header('Location: ' . $url, true, $status);
    exit;
}

/**
 * Get asset URL
 * @param string $path Path relative to assets directory
 * @return string Full URL to asset
 */
function asset_url($path) {
    return BASE_URL . 'assets/' . ltrim($path, '/');
}

/**
 * Render a view with data
 * @param string $view View name (without extension)
 * @param array $data Data to pass to the view
 * @param string $layout Layout name (without extension)
 * @return string Rendered HTML
 */
function render_view($view, $data = [], $layout = 'default') {
    // Extract data to make variables available in view
    extract($data);
    
    // Start output buffering
    ob_start();
    
    // Include the view file
    $view_file = VIEWS_PATH . '/' . $view . '.php';
    if (file_exists($view_file)) {
        include $view_file;
    } else {
        throw new Exception("View file not found: {$view_file}");
    }
    
    // Get the view content
    $content = ob_get_clean();
    
    // If no layout, return the view content
    if ($layout === null) {
        return $content;
    }
    
    // Start output buffering again for the layout
    ob_start();
    
    // Include the layout file
    $layout_file = VIEWS_PATH . '/layouts/' . $layout . '.php';
    if (file_exists($layout_file)) {
        include $layout_file;
    } else {
        throw new Exception("Layout file not found: {$layout_file}");
    }
    
    // Return the final rendered HTML
    return ob_get_clean();
}

/**
 * Render a partial view with data
 * @param string $partial Partial view name (without extension)
 * @param array $data Data to pass to the partial
 * @return string Rendered HTML
 */
function render_partial($partial, $data = []) {
    // Extract data to make variables available in partial
    extract($data);
    
    // Start output buffering
    ob_start();
    
    // Include the partial file
    $partial_file = VIEWS_PATH . '/partials/' . $partial . '.php';
    if (file_exists($partial_file)) {
        include $partial_file;
    } else {
        throw new Exception("Partial file not found: {$partial_file}");
    }
    
    // Return the rendered HTML
    return ob_get_clean();
}

/**
 * Check if rate limit is exceeded
 * @return bool True if rate limit exceeded, false otherwise
 */
function is_rate_limited() {
    $current_time = time();
    $window_start = $_SESSION['rate_limit']['window_start'];
    $count = $_SESSION['rate_limit']['count'];
    
    // Reset window if expired
    if ($current_time - $window_start > RATE_LIMIT_WINDOW) {
        $_SESSION['rate_limit'] = [
            'count' => 0,
            'window_start' => $current_time
        ];
        return false;
    }
    
    // Check if limit exceeded
    return $count >= RATE_LIMIT_REQUESTS;
}

/**
 * Increment rate limit counter
 */
function increment_rate_limit() {
    $_SESSION['rate_limit']['count']++;
}