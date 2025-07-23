<?php
/**
 * Base Controller Class
 * All controllers should extend this class
 */

class Controller {
    /**
     * Render a view with data
     * @param string $view View name (without extension)
     * @param array $data Data to pass to the view
     * @param string $layout Layout name (without extension)
     * @return string Rendered HTML
     */
    protected function render($view, $data = [], $layout = 'default') {
        return render_view($view, $data, $layout);
    }
    
    /**
     * Render a partial view with data
     * @param string $partial Partial view name (without extension)
     * @param array $data Data to pass to the partial
     * @return string Rendered HTML
     */
    protected function renderPartial($partial, $data = []) {
        return render_partial($partial, $data);
    }
    
    /**
     * Send JSON response
     * @param mixed $data Data to encode as JSON
     * @param int $status HTTP status code
     */
    protected function json($data, $status = 200) {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
    
    /**
     * Redirect to a URL
     * @param string $url URL to redirect to
     * @param int $status HTTP status code
     */
    protected function redirect($url, $status = 302) {
        redirect($url, $status);
    }
    
    /**
     * Get request method
     * @return string Request method (GET, POST, etc.)
     */
    protected function getMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }
    
    /**
     * Check if request is AJAX
     * @return bool True if AJAX request, false otherwise
     */
    protected function isAjax() {
        return is_ajax_request();
    }
    
    /**
     * Get request data
     * @param string $method Request method (GET, POST, etc.)
     * @return array Request data
     */
    protected function getRequestData($method = null) {
        $method = $method ?? $this->getMethod();
        
        switch (strtoupper($method)) {
            case 'GET':
                return $_GET;
            case 'POST':
                return $_POST;
            default:
                return [];
        }
    }
    
    /**
     * Get JSON request data
     * @return array|null Decoded JSON data or null if invalid
     */
    protected function getJsonData() {
        $json = file_get_contents('php://input');
        return json_decode($json, true);
    }
}