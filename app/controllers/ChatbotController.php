<?php
/**
 * Chatbot Controller
 * Handles chatbot-related requests and responses
 */

require_once APP_PATH . '/core/Controller.php';
require_once APP_PATH . '/services/ChatbotService.php';

class ChatbotController extends Controller {
    private $chatbotService;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->chatbotService = new ChatbotService();
    }
    
    /**
     * Index action - Display the chatbot interface
     */
    public function index() {
        // Get chat history from session
        $chatHistory = $_SESSION['chat_history'] ?? [];
        
        // Render the chatbot view
        echo $this->render('chatbot/index', [
            'chatHistory' => $chatHistory
        ]);
    }
    
    /**
     * Send message action - Process user message and return bot response
     */
    public function sendMessage() {
        // Check if request is AJAX
        if (!$this->isAjax()) {
            $this->redirect('/');
            return;
        }
        
        // Get message from request
        $data = $this->getRequestData();
        $message = $data['message'] ?? '';
        
        if (empty($message)) {
            $this->json([
                'error' => 'Message is required'
            ], 400);
            return;
        }
        
        // Check rate limit
        if (is_rate_limited()) {
            $this->json([
                'error' => 'Rate limit exceeded. Please try again later.'
            ], 429);
            return;
        }
        
        // Increment rate limit counter
        increment_rate_limit();
        
        // Add user message to chat history
        $_SESSION['chat_history'][] = [
            'role' => 'user',
            'content' => $message,
            'time' => get_formatted_time()
        ];
        
        // Get bot response
        $response = $this->chatbotService->generateResponse($message);
        
        // Add bot response to chat history
        $_SESSION['chat_history'][] = [
            'role' => 'bot',
            'content' => $response,
            'time' => get_formatted_time()
        ];
        
        // Return response as JSON
        $this->json([
            'response' => $response,
            'time' => get_formatted_time()
        ]);
    }
    
    /**
     * Clear chat action - Clear chat history
     */
    public function clearChat() {
        // Check if request is AJAX
        if (!$this->isAjax()) {
            $this->redirect('/');
            return;
        }
        
        // Clear chat history
        $_SESSION['chat_history'] = [];
        
        // Return success response
        $this->json([
            'success' => true
        ]);
    }
}