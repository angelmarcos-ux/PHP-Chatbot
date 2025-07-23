<?php
/**
 * Metronic Chatbot Interface
 * A modern chatbot UI built with Metronic Framework
 * Integrated with DeepSeek AI API
 */

// Include configuration
require_once 'config.php';

// Simple session handling for demo purposes
session_start();

// Initialize rate limiting
if (!isset($_SESSION['api_requests'])) {
    $_SESSION['api_requests'] = [];
}

// Initialize chat history if not exists
if (!isset($_SESSION['chat_history'])) {
    $_SESSION['chat_history'] = [];
}

// Handle AJAX requests for chat messages
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'send_message') {
    $user_message = trim($_POST['message'] ?? '');
    
    if (!empty($user_message)) {
        // Add user message to history
        $_SESSION['chat_history'][] = [
            'type' => 'user',
            'message' => htmlspecialchars($user_message),
            'timestamp' => date('H:i')
        ];
        
        // Generate bot response (preset data)
        $bot_response = generateBotResponse($user_message);
        $_SESSION['chat_history'][] = [
            'type' => 'bot',
            'message' => $bot_response,
            'timestamp' => date('H:i')
        ];
    }
    
    // Return JSON response for AJAX
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'chat_history' => $_SESSION['chat_history']
    ]);
    exit;
}

// Clear chat history
if (isset($_GET['clear'])) {
    $_SESSION['chat_history'] = [];
    header('Location: index.php');
    exit;
}

/**
 * Check rate limiting for API requests
 */
function checkRateLimit() {
    $current_time = time();
    $window_start = $current_time - RATE_LIMIT_WINDOW;
    
    // Clean old requests
    $_SESSION['api_requests'] = array_filter($_SESSION['api_requests'], function($timestamp) use ($window_start) {
        return $timestamp > $window_start;
    });
    
    // Check if limit exceeded
    if (count($_SESSION['api_requests']) >= RATE_LIMIT_REQUESTS) {
        return false;
    }
    
    // Add current request
    $_SESSION['api_requests'][] = $current_time;
    return true;
}

/**
 * Generate bot responses using DeepSeek API
 */
function generateBotResponse($message) {
    global $fallback_responses;
    
    // Check if API key is configured
    if (DEEPSEEK_API_KEY === 'YOUR_DEEPSEEK_API_KEY_HERE' || empty(DEEPSEEK_API_KEY)) {
        return 'Please configure your DeepSeek API key in the config.php file to enable AI responses.';
    }
    
    // Check rate limiting
    if (!checkRateLimit()) {
        return 'Please wait a moment before sending another message. I need a brief pause to process requests properly.';
    }
    
    // Get conversation history for context
    $conversation_messages = [];
    if (isset($_SESSION['chat_history']) && count($_SESSION['chat_history']) > 0) {
        // Include last 6 messages for context (3 exchanges)
        $recent_history = array_slice($_SESSION['chat_history'], -6);
        foreach ($recent_history as $msg) {
            $conversation_messages[] = [
                'role' => $msg['type'] === 'user' ? 'user' : 'assistant',
                'content' => strip_tags($msg['message'])
            ];
        }
    }
    
    // Prepare API request with conversational context
    $messages = [
        [
            'role' => 'system',
            'content' => 'You are Alex, a friendly and knowledgeable AI assistant. You have a warm, conversational personality and love helping people. Key traits:\n\n- Be genuinely curious about the user and remember what they share\n- Use a natural, friendly tone like talking to a good friend\n- Ask follow-up questions to keep conversations flowing\n- Share relevant insights and be helpful without being overly formal\n- Use emojis occasionally to add warmth (but not excessively)\n- Remember context from the conversation and reference it naturally\n- Be encouraging and positive while staying authentic\n\nKeep responses conversational and engaging, typically 1-3 sentences unless more detail is specifically requested.'
        ]
    ];
    
    // Add conversation history
    $messages = array_merge($messages, $conversation_messages);
    
    // Add current user message
    $messages[] = [
        'role' => 'user',
        'content' => $message
    ];
    
    $data = [
         'model' => DEEPSEEK_MODEL,
         'messages' => $messages,
         'max_tokens' => MAX_TOKENS,
         'temperature' => 0.8, // Slightly higher for more personality
         'stream' => false
     ];
    
    // Make API request
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => DEEPSEEK_API_URL,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . DEEPSEEK_API_KEY
        ],
        CURLOPT_TIMEOUT => API_TIMEOUT,
        CURLOPT_SSL_VERIFYPEER => false, // Disable SSL verification for development
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_USERAGENT => 'Metronic-Chatbot/1.0'
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    // Handle cURL errors
    if ($curl_error) {
        error_log('DeepSeek API cURL Error: ' . $curl_error);
        return $fallback_responses[array_rand($fallback_responses)];
    }
    
    // Handle HTTP errors
    if ($http_code !== 200) {
        error_log('DeepSeek API HTTP Error: ' . $http_code . ' - ' . $response);
        return $fallback_responses[array_rand($fallback_responses)];
    }
    
    // Parse response
    $decoded_response = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('DeepSeek API JSON Error: ' . json_last_error_msg());
        return $fallback_responses[array_rand($fallback_responses)];
    }
    
    // Extract message content
    if (isset($decoded_response['choices'][0]['message']['content'])) {
        $ai_response = trim($decoded_response['choices'][0]['message']['content']);
        
        // Sanitize response
        $ai_response = htmlspecialchars($ai_response, ENT_QUOTES, 'UTF-8');
        
        // Ensure response is not empty
        if (!empty($ai_response)) {
            return $ai_response;
        }
    }
    
    // Fallback if no valid response
    error_log('DeepSeek API: No valid response content');
    return $fallback_responses[array_rand($fallback_responses)];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Metronic Chatbot Interface</title>
    <meta name="description" content="Modern chatbot interface built with Metronic Framework" />
    <meta name="keywords" content="chatbot, metronic, php, ui, interface" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Metronic Chatbot Interface" />
    <meta property="og:site_name" content="Metronic Chatbot" />
    <link rel="shortcut icon" href="assets/media/logos/favicon.ico" />
    
    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700" />
    
    <!-- Metronic CSS -->
    <link href="assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
    <link href="assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
    
    <!-- Custom Chatbot Styles -->
    <link href="assets/css/chatbot.css" rel="stylesheet" type="text/css" />
</head>

<body id="kt_body" class="app-blank bgi-size-cover bgi-attachment-fixed bgi-position-center">
    <div class="d-flex flex-column flex-root" id="kt_app_root">
        <div class="d-flex flex-column flex-lg-row flex-column-fluid">
            <!-- Main Content -->
            <div class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-5 p-lg-10 order-2 order-lg-1">
                <div class="d-flex flex-center flex-column flex-lg-row-fluid">
                    <!-- Chatbot Container -->
                    <div class="w-100 w-lg-500px p-5 p-lg-10 chat-container">
                        <!-- Header -->
                        <div class="text-center mb-11">
                            <h1 class="text-dark fw-bolder mb-3">Metronic Chatbot</h1>
                            <div class="text-gray-500 fw-semibold fs-6">Intelligent Assistant powered by Metronic Framework</div>
                        </div>
                        
                        <!-- Chat Container -->
                        <div class="card chat-card shadow-lg">
                            <div class="card-header">
                                <div class="card-title text-white d-flex align-items-center">
                                    <div class="symbol symbol-40px symbol-circle me-3">
                                        <div class="symbol-label bg-white bg-opacity-20">
                                            <i class="ki-duotone ki-message-text-2 fs-2 text-white">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                                <span class="path3"></span>
                                            </i>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 class="text-white mb-0">Chat Assistant</h5>
                                        <small class="text-white opacity-75">Online now</small>
                                    </div>
                                </div>
                                <div class="card-toolbar">
                                    <a href="?clear=1" class="btn btn-sm btn-icon btn-light-primary" title="Clear Chat">
                                        <i class="ki-duotone ki-trash fs-4">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                            <span class="path3"></span>
                                            <span class="path4"></span>
                                            <span class="path5"></span>
                                        </i>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Chat Messages Area -->
                            <div class="card-body" id="chat-messages" style="height: 400px; overflow-y: auto;">
                                <?php if (empty($_SESSION['chat_history'])): ?>
                                    <div class="welcome-container">
                                        <div class="welcome-icon-container">
                                            <i class="ki-duotone ki-message-question fs-2x text-primary">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                                <span class="path3"></span>
                                            </i>
                                        </div>
                                        <h4 class="text-gray-800 mb-2">Hey there! I'm Alex 👋</h4>
                                        <p class="text-gray-600 mb-0">I'm here to chat and help with whatever you need. What's on your mind today?</p>
                                    </div>
                                <?php else: ?>
                                    <div class="message-container">
                                        <?php foreach ($_SESSION['chat_history'] as $chat): ?>
                                            <?php if ($chat['type'] === 'user'): ?>
                                                <div class="message-row user">
                                                    <div class="message-content">
                                                        <div class="message-meta">
                                                            <span class="text-muted fs-8 me-2"><?= $chat['timestamp'] ?></span>
                                                            <span class="text-gray-700 fw-semibold fs-7">You</span>
                                                        </div>
                                                        <div class="user-message message-bubble">
                                                            <?= $chat['message'] ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            <?php else: ?>
                                                <div class="message-row bot">
                                                    <div class="message-content">
                                                        <div class="message-meta">
                                                            <div class="symbol symbol-25px symbol-circle me-2">
                                                                <div class="symbol-label bg-success text-white fs-8 fw-bold">AI</div>
                                                            </div>
                                                            <span class="text-gray-700 fw-semibold fs-7 me-2">Assistant</span>
                                                            <span class="text-muted fs-8"><?= $chat['timestamp'] ?></span>
                                                        </div>
                                                        <div class="bot-message message-bubble">
                                                            <?= $chat['message'] ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                            
                            <!-- Chat Input -->
                            <div class="card-footer">
                                <form id="chat-form">
                                    <div class="chat-input-container">
                                        <input type="text" id="message-input" class="form-control" placeholder="What's on your mind? Let's chat!" required />
                                        <button type="submit" class="btn btn-primary" id="send-btn">
                                            <i class="ki-duotone ki-send fs-3">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                            </i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="text-center mt-5">
                            <div class="text-gray-500 fw-semibold fs-7 mb-3">Try these conversation starters:</div>
                            <div class="d-flex flex-wrap justify-content-center gap-2">
                                <button class="btn btn-sm btn-light-primary quick-action" data-message="Hi Alex! How are you doing today?">👋 Say Hello</button>
                                <button class="btn btn-sm btn-light-primary quick-action" data-message="Can you tell me a bit about yourself?">🤖 About You</button>
                                <button class="btn btn-sm btn-light-primary quick-action" data-message="What kind of things can we chat about?">💬 What Can We Talk About?</button>
                                <button class="btn btn-sm btn-light-primary quick-action" data-message="Tell me something interesting!">✨ Surprise Me</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Side Panel -->
            <div class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2" style="background-image: url(assets/media/misc/auth-bg.png)">
                <div class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
                    <div class="mb-0 mb-lg-10">
                        <h1 class="text-white fw-bolder fs-2qx mb-5">Modern Chatbot Interface</h1>
                        <div class="text-white fs-4 fw-semibold">Built with Metronic Framework for exceptional user experience</div>
                    </div>
                    
                    <div class="d-flex flex-center flex-wrap px-5">
                        <div class="d-flex flex-center m-3 m-md-6">
                            <div class="d-flex flex-center flex-shrink-0 bg-white bg-opacity-10 rounded w-65px h-65px w-lg-75px h-lg-75px me-4">
                                <i class="ki-duotone ki-message-text-2 fs-2x fs-lg-1 text-white">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                            <div class="d-flex flex-column">
                                <h4 class="text-white fw-bold mb-0">Real-time Chat</h4>
                                <span class="text-white opacity-75">Instant responses</span>
                            </div>
                        </div>
                        
                        <div class="d-flex flex-center m-3 m-md-6">
                            <div class="d-flex flex-center flex-shrink-0 bg-white bg-opacity-10 rounded w-65px h-65px w-lg-75px h-lg-75px me-4">
                                <i class="ki-duotone ki-rocket fs-2x fs-lg-1 text-white">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                </i>
                            </div>
                            <div class="d-flex flex-column">
                                <h4 class="text-white fw-bold mb-0">Smart AI</h4>
                                <span class="text-white opacity-75">Intelligent responses</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="assets/plugins/global/plugins.bundle.js"></script>
    <script src="assets/js/scripts.bundle.js"></script>
    <script src="assets/js/chatbot.js"></script>
</body>
</html>