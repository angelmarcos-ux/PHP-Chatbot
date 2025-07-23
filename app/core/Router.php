<?php
/**
 * Router Class
 * Handles routing requests to appropriate controllers and actions
 */

class Router {
    private $routes = [];
    private $notFoundCallback;
    
    /**
     * Add a route
     * @param string $method HTTP method (GET, POST, etc.)
     * @param string $path URL path
     * @param callable $callback Callback function or controller action
     */
    public function addRoute($method, $path, $callback) {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'callback' => $callback
        ];
    }
    
    /**
     * Add a GET route
     * @param string $path URL path
     * @param callable $callback Callback function or controller action
     */
    public function get($path, $callback) {
        $this->addRoute('GET', $path, $callback);
    }
    
    /**
     * Add a POST route
     * @param string $path URL path
     * @param callable $callback Callback function or controller action
     */
    public function post($path, $callback) {
        $this->addRoute('POST', $path, $callback);
    }
    
    /**
     * Set callback for 404 Not Found
     * @param callable $callback Callback function
     */
    public function setNotFound($callback) {
        $this->notFoundCallback = $callback;
    }
    
    /**
     * Match the current request to a route
     * @param string $method HTTP method
     * @param string $path URL path
     * @return array|false Route data if matched, false otherwise
     */
    private function matchRoute($method, $path) {
        foreach ($this->routes as $route) {
            // Check if method matches
            if ($route['method'] !== $method) {
                continue;
            }
            
            // Convert route pattern to regex
            $pattern = $this->patternToRegex($route['path']);
            
            // Check if path matches pattern
            if (preg_match($pattern, $path, $matches)) {
                // Remove the full match
                array_shift($matches);
                
                // Return route data with parameters
                return [
                    'callback' => $route['callback'],
                    'params' => $matches
                ];
            }
        }
        
        return false;
    }
    
    /**
     * Convert route pattern to regex
     * @param string $pattern Route pattern
     * @return string Regex pattern
     */
    private function patternToRegex($pattern) {
        // Replace :param with named capture groups
        $pattern = preg_replace('/\:([a-zA-Z0-9_]+)/', '([^/]+)', $pattern);
        
        // Escape forward slashes and add start/end anchors
        return '#^' . $pattern . '$#';
    }
    
    /**
     * Dispatch the current request
     */
    public function dispatch() {
        // Get request method and path
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Handle root path
        if ($path === '/' || $path === '') {
            $path = '/';
        }
        
        // Debug information
        if (isset($_GET['debug'])) {
            echo '<pre>';
            echo 'Router Debug Information:\n';
            echo 'Method: ' . $method . '\n';
            echo 'Path: ' . $path . '\n';
            echo '</pre>';
        }
        
        // Remove base path if defined
        if (defined('BASE_PATH') && !empty(BASE_PATH)) {
            $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
            $path = substr($path, strlen($basePath));
        }
        
        // Match route
        $route = $this->matchRoute($method, $path);
        
        if ($route) {
            // Call the route callback with parameters
            $callback = $route['callback'];
            $params = $route['params'];
            
            // If callback is a string in format 'Controller@action'
            if (is_string($callback) && strpos($callback, '@') !== false) {
                list($controller, $action) = explode('@', $callback);
                
                // Create controller instance
                $controllerClass = $controller; // Controller name is already complete
                $controllerInstance = new $controllerClass();
                
                // Call controller action with parameters
                return call_user_func_array([$controllerInstance, $action], $params);
            }
            
            // Otherwise, call the callback directly
            return call_user_func_array($callback, $params);
        }
        
        // No route matched, call not found callback
        if ($this->notFoundCallback) {
            return call_user_func($this->notFoundCallback);
        }
        
        // Default 404 response
        header('HTTP/1.1 404 Not Found');
        echo '404 Not Found';
    }
}