<?php
/**
 * Chatbot Service
 * Handles chatbot business logic and API communication
 */

class ChatbotService {
    private $conversationalPatterns;
    private $fallbackResponses;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->conversationalPatterns = require APP_PATH . '/config/conversational_patterns.php';
        $this->fallbackResponses = require APP_PATH . '/config/fallback_responses.php';
    }
    
    /**
     * Generate a response to a user message
     * @param string $message User message
     * @return string Bot response
     */
    public function generateResponse($message) {
        // Try to generate a local response first
        $localResponse = $this->generateLocalResponse($message);
        if ($localResponse) {
            return $localResponse;
        }
        
        // If no local response, use the API
        return $this->generateApiResponse($message);
    }
    
    /**
     * Generate a local response based on conversational patterns
     * @param string $message User message
     * @return string|null Bot response or null if no match
     */
    private function generateLocalResponse($message) {
        foreach ($this->conversationalPatterns as $intent => $data) {
            if (matches_patterns($message, $data['patterns'])) {
                return get_random_item($data['responses']);
            }
        }
        
        return null;
    }
    
    /**
     * Generate a response using the DeepSeek API
     * @param string $message User message
     * @return string Bot response
     */
    private function generateApiResponse($message) {
        try {
            // Prepare conversation context
            $context = $this->prepareConversationContext();
            
            // Add user message to context
            $context[] = [
                'role' => 'user',
                'content' => $message
            ];
            
            // Prepare API request data
            $data = [
                'model' => DEEPSEEK_MODEL,
                'messages' => $context,
                'max_tokens' => MAX_TOKENS,
                'temperature' => TEMPERATURE
            ];
            
            // Initialize cURL session
            $ch = curl_init(DEEPSEEK_API_URL);
            
            // Set cURL options
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . DEEPSEEK_API_KEY
            ]);
            curl_setopt($ch, CURLOPT_TIMEOUT, API_TIMEOUT);
            
            // Execute cURL request
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            // Check for cURL errors
            if (curl_errno($ch)) {
                curl_close($ch);
                return $this->generateFallbackResponse('curl_error');
            }
            
            // Close cURL session
            curl_close($ch);
            
            // Check HTTP response code
            if ($httpCode !== 200) {
                return $this->generateFallbackResponse('http_error');
            }
            
            // Parse JSON response
            $responseData = json_decode($response, true);
            
            // Check if response is valid
            if (!isset($responseData['choices'][0]['message']['content'])) {
                return $this->generateFallbackResponse('invalid_response');
            }
            
            // Get and sanitize AI response
            $aiResponse = $responseData['choices'][0]['message']['content'];
            $aiResponse = $this->sanitizeAiOutput($aiResponse);
            
            return $aiResponse;
        } catch (Exception $e) {
            // Log the error
            error_log('API Error: ' . $e->getMessage());
            
            // Return fallback response
            return $this->generateFallbackResponse('exception');
        }
    }
    
    /**
     * Prepare conversation context from chat history
     * @return array Conversation context
     */
    private function prepareConversationContext() {
        $context = [];
        
        // Add system message
        $context[] = [
            'role' => 'system',
            'content' => 'You are Alex, a friendly and helpful AI assistant. You are conversational, engaging, and personable. You respond in a natural, human-like manner with occasional emojis to express emotion. Keep your responses concise but informative.'
        ];
        
        // Add chat history (limited to last 10 messages)
        $chatHistory = array_slice($_SESSION['chat_history'] ?? [], -10);
        
        foreach ($chatHistory as $message) {
            $context[] = [
                'role' => $message['role'] === 'bot' ? 'assistant' : 'user',
                'content' => $message['content']
            ];
        }
        
        return $context;
    }
    
    /**
     * Generate a fallback response when API fails
     * @param string $errorType Type of error
     * @return string Fallback response
     */
    private function generateFallbackResponse($errorType) {
        // Log the error type
        error_log('Fallback response triggered: ' . $errorType);
        
        // Return a random fallback response
        return get_random_item($this->fallbackResponses);
    }
    
    /**
     * Sanitize AI output to prevent XSS and other issues
     * @param string $output AI output
     * @return string Sanitized output
     */
    private function sanitizeAiOutput($output) {
        // Remove any HTML tags that might be in the response
        $output = strip_tags($output);
        
        // Trim whitespace
        $output = trim($output);
        
        // Ensure output is not empty
        if (empty($output)) {
            return 'I apologize, but I couldn\'t generate a proper response. Could you please try again?';
        }
        
        return $output;
    }
}