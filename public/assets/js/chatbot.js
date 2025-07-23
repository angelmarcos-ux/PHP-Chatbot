/**
 * Metronic Chatbot JavaScript
 * Handles chat functionality, AJAX requests, and UI interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const quickActions = document.querySelectorAll('.quick-action');

    // Chat state
    let isTyping = false;
    let messageQueue = [];

    // Conversational Response System
    const conversationalPatterns = {
        greetings: {
            patterns: [/\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/i],
            responses: [
                'Hey there! 👋 Great to see you! How are you doing today?',
                'Hello! I\'m Alex, and I\'m excited to chat with you! What\'s on your mind?',
                'Hi! 😊 Thanks for stopping by. I\'m here and ready to help with whatever you need!',
                'Hey! Good to meet you! I\'m feeling chatty today - what would you like to talk about?'
            ]
        },
        how_are_you: {
            patterns: [/\b(how are you|how\'re you|how do you feel|what\'s up)\b/i],
            responses: [
                'I\'m doing fantastic, thanks for asking! 😊 I love meeting new people and having conversations. How about you?',
                'I\'m great! Every conversation is an adventure for me. What\'s been the highlight of your day so far?',
                'I\'m wonderful! I\'m always excited to chat and learn something new. How has your day been treating you?',
                'I\'m doing amazing! There\'s nothing I enjoy more than a good conversation. What\'s new with you?'
            ]
        },
        about_me: {
            patterns: [/\b(tell me about yourself|who are you|what are you|about you)\b/i],
            responses: [
                'I\'m Alex! 🤖 I\'m your friendly AI assistant who loves having conversations. I\'m curious, helpful, and always eager to learn from our chats!',
                'Hi! I\'m Alex - think of me as your digital conversation partner. I enjoy discussing everything from daily life to big ideas. What interests you most?',
                'I\'m Alex, your AI companion! I\'m designed to be conversational, helpful, and genuinely interested in what you have to say. I love learning about people!',
                'I\'m Alex! 😊 I\'m here to chat, help, and hopefully brighten your day a bit. I find every person fascinating - tell me something about yourself!'
            ]
        },
        topics: {
            patterns: [/\b(what can we talk about|what do you know|topics|subjects|discuss)\b/i],
            responses: [
                'Oh, so many things! 🌟 I love discussing daily life, hobbies, technology, books, movies, travel, food, or even philosophical questions. What sparks your curiosity?',
                'We can chat about anything that interests you! Whether it\'s your day, your passions, current events, creative projects, or just random thoughts - I\'m all ears!',
                'The possibilities are endless! 💭 Tell me about your hobbies, ask me questions, share what\'s on your mind, or let\'s explore topics like science, art, or life in general!',
                'I\'m up for discussing whatever you\'d like! Your interests, experiences, questions about life, creative ideas, or even just how you\'re feeling today. What sounds good to you?'
            ]
        },
        surprise: {
            patterns: [/\b(surprise me|tell me something interesting|something cool|fun fact)\b/i],
            responses: [
                'Here\'s something cool: Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible! 🍯 What\'s the most interesting thing you\'ve learned recently?',
                'Fun fact: Octopuses have three hearts and blue blood! Two hearts pump blood to their gills, and the third pumps blood to the rest of their body. 🐙 Do you have any favorite animal facts?',
                'Here\'s something fascinating: The human brain has about 86 billion neurons, and each one can connect to thousands of others. That means you have more neural connections than there are stars in the Milky Way! 🧠✨ What amazes you most about the human body?',
                'Cool fact: A group of flamingos is called a "flamboyance"! 🦩 And they\'re pink because of the shrimp and algae they eat. What\'s your favorite collective animal name?'
            ]
        },
        thanks: {
            patterns: [/\b(thank you|thanks|appreciate|grateful)\b/i],
            responses: [
                'You\'re so welcome! 😊 It makes me happy to help. Is there anything else you\'d like to chat about?',
                'My pleasure! I really enjoy our conversation. What else is on your mind?',
                'You\'re very welcome! That\'s what I\'m here for. Feel free to ask me anything else!',
                'Aww, thank you! 💙 I love being helpful. What would you like to explore next?'
            ]
        },
        goodbye: {
            patterns: [/\b(bye|goodbye|see you|farewell|take care|gotta go)\b/i],
            responses: [
                'Goodbye! 👋 It was wonderful chatting with you. Come back anytime - I\'ll be here!',
                'Take care! 😊 Thanks for the great conversation. I hope to see you again soon!',
                'Bye for now! It was really nice talking with you. Have a fantastic day!',
                'See you later! 🌟 Thanks for brightening my day with our chat. Until next time!'
            ]
        },
        default: {
            patterns: [/.*/],
            responses: [
                'That\'s interesting! 🤔 Tell me more about that - I\'d love to hear your thoughts on it.',
                'I find that fascinating! Can you share more details? I\'m genuinely curious to learn more.',
                'That sounds intriguing! 💭 What made you think about that? I\'d love to dive deeper into this topic.',
                'Hmm, that\'s a great point! 😊 What\'s your perspective on it? I enjoy hearing different viewpoints.',
                'That\'s really cool! Can you tell me more? I love learning new things from our conversations.',
                'Interesting! 🌟 I\'d love to hear more about your experience with that. What was it like?'
            ]
        }
    };

    function generateLocalResponse(message) {
        const lowerMessage = message.toLowerCase().trim();
        
        // Check each pattern category
        for (const [category, data] of Object.entries(conversationalPatterns)) {
            if (category === 'default') continue; // Skip default for now
            
            for (const pattern of data.patterns) {
                if (pattern.test(lowerMessage)) {
                    const responses = data.responses;
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }
        
        // Use default responses for unmatched messages
        const defaultResponses = conversationalPatterns.default.responses;
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    function generateFallbackResponse() {
        const fallbackResponses = [
            'I\'m having a bit of trouble connecting right now, but I\'m still here to chat! 😊 What would you like to talk about?',
            'Looks like there\'s a small hiccup with my connection, but no worries! I can still have a great conversation with you. What\'s on your mind?',
            'I\'m experiencing some technical difficulties, but I\'m still ready to chat! 💬 Tell me something interesting about your day!',
            'My connection seems a bit spotty, but I\'m here and excited to talk with you! What would you like to discuss?'
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    /**
     * Initialize chatbot functionality
     */
    function init() {
        // Check if required elements exist
        if (!chatMessages || !messageInput || !sendBtn) {
            console.error('Required chatbot elements not found');
            return;
        }
        
        setupEventListeners();
        scrollToBottom();
        focusInput();
        
        // Show welcome message if chat is empty
        if (chatMessages.children.length === 1 && chatMessages.querySelector('.text-center')) {
            showWelcomeMessage();
        }
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Chat form submission
        if (chatForm) {
            chatForm.addEventListener('submit', handleFormSubmit);
        }

        // Quick action buttons
        quickActions.forEach(button => {
            button.addEventListener('click', handleQuickAction);
        });

        // Enter key handling
        if (messageInput) {
            messageInput.addEventListener('keypress', handleKeyPress);
            messageInput.addEventListener('input', handleInputChange);
        }

        // Auto-resize textarea (if needed)
        if (messageInput) {
            messageInput.addEventListener('input', autoResizeInput);
        }
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!messageInput) return;
        
        const message = messageInput.value.trim();
        if (!message || isTyping) return;

        sendMessage(message);
    }

    /**
     * Handle quick action button clicks
     */
    function handleQuickAction(e) {
        e.preventDefault();
        const message = e.target.getAttribute('data-message');
        if (message && !isTyping && messageInput) {
            messageInput.value = message;
            sendMessage(message);
        }
    }

    /**
     * Handle key press events
     */
    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit(e);
        }
    }

    /**
     * Handle input changes
     */
    function handleInputChange(e) {
        const message = e.target.value.trim();
        if (sendBtn) {
            sendBtn.disabled = !message || isTyping;
        }
    }

    /**
     * Auto-resize input field
     */
    function autoResizeInput() {
        if (messageInput) {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
        }
    }

    /**
     * Send message to server
     */
    function sendMessage(message) {
        if (isTyping) return;

        // Set loading state
        setTypingState(true);
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.classList.add('btn-loading');
        }
        
        // Clear input
        if (messageInput) {
            messageInput.value = '';
        }
        
        // Remove welcome message if present
        removeWelcomeMessage();

        // Add user message to UI immediately
        addMessageToUI({
            type: 'user',
            message: escapeHtml(message),
            timestamp: getCurrentTime()
        });

        // Show typing indicator
        showTypingIndicator();

        // Try local conversational response first
        const localResponse = generateLocalResponse(message);
        if (localResponse) {
            hideTypingIndicator();
            // Simulate natural typing delay
            setTimeout(() => {
                addMessageToUI({
                    type: 'bot',
                    message: localResponse,
                    timestamp: getCurrentTime()
                });
                setTypingState(false);
                if (sendBtn) {
                    sendBtn.disabled = false;
                    sendBtn.classList.remove('btn-loading');
                }
            }, 800 + Math.random() * 1200);
            return;
        }

        // Fallback to API if no local response
        const formData = new FormData();
        formData.append('action', 'send_message');
        formData.append('message', message);

        fetch('index.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideTypingIndicator();
            
            if (data.success && data.chat_history) {
                // Get the latest bot message
                const latestMessages = data.chat_history.slice(-2);
                const botMessage = latestMessages.find(msg => msg.type === 'bot');
                
                if (botMessage) {
                    // Simulate typing delay for better UX
                    setTimeout(() => {
                        addMessageToUI(botMessage);
                        setTypingState(false);
                    }, 800 + Math.random() * 1200);
                } else {
                    setTypingState(false);
                }
            } else {
                // Use local fallback response
                const fallbackResponse = generateFallbackResponse();
                setTimeout(() => {
                    addMessageToUI({
                        type: 'bot',
                        message: fallbackResponse,
                        timestamp: getCurrentTime()
                    });
                    setTypingState(false);
                }, 800);
            }
        })
        .catch(error => {
            console.error('Chat error:', error);
            hideTypingIndicator();
            // Use local fallback response instead of error
            const fallbackResponse = generateFallbackResponse();
            setTimeout(() => {
                addMessageToUI({
                    type: 'bot',
                    message: fallbackResponse,
                    timestamp: getCurrentTime()
                });
                setTypingState(false);
            }, 800);
        })
        .finally(() => {
            // Ensure UI is always reset
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.classList.remove('btn-loading');
            }
        });
    }

    /**
     * Add message to UI
     */
    function addMessageToUI(messageData) {
        if (!chatMessages) {
            console.error('Chat messages container not found');
            return;
        }
        
        const messageElement = createMessageElement(messageData);
        chatMessages.appendChild(messageElement);
        scrollToBottom();
        
        // Animate message appearance
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);
    }

    /**
     * Create message element
     */
    function createMessageElement(messageData) {
        const messageDiv = document.createElement('div');
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        messageDiv.style.transition = 'all 0.3s ease';
        
        if (messageData.type === 'user') {
            messageDiv.className = 'd-flex justify-content-end mb-5';
            messageDiv.innerHTML = `
                <div class="d-flex flex-column align-items-end">
                    <div class="d-flex align-items-center mb-2">
                        <div class="me-3">
                            <span class="text-muted fs-7">${messageData.timestamp}</span>
                            <span class="text-dark fw-bold fs-6">You</span>
                        </div>
                        <div class="symbol symbol-35px symbol-circle">
                            <div class="symbol-label bg-light-primary text-primary fw-semibold">U</div>
                        </div>
                    </div>
                    <div class="p-5 rounded bg-light-primary text-dark fw-semibold mw-lg-400px text-end message-bubble user-message">
                        ${messageData.message}
                    </div>
                </div>
            `;
        } else {
            messageDiv.className = 'd-flex justify-content-start mb-5';
            messageDiv.innerHTML = `
                <div class="d-flex flex-column align-items-start">
                    <div class="d-flex align-items-center mb-2">
                        <div class="symbol symbol-35px symbol-circle me-3 online-status">
                            <div class="symbol-label bg-light-info text-info fw-semibold">AI</div>
                        </div>
                        <div>
                            <span class="text-dark fw-bold fs-6">Assistant</span>
                            <span class="text-muted fs-7">${messageData.timestamp}</span>
                        </div>
                    </div>
                    <div class="p-5 rounded bg-light-info text-dark fw-semibold mw-lg-400px text-start message-bubble bot-message">
                        ${messageData.message}
                    </div>
                </div>
            `;
        }
        
        return messageDiv;
    }

    /**
     * Show typing indicator
     */
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'd-flex justify-content-start mb-5';
        typingDiv.innerHTML = `
            <div class="d-flex flex-column align-items-start">
                <div class="d-flex align-items-center mb-2">
                    <div class="symbol symbol-35px symbol-circle me-3">
                        <div class="symbol-label bg-light-info text-info fw-semibold">AI</div>
                    </div>
                    <div>
                        <span class="text-dark fw-bold fs-6">Assistant</span>
                        <span class="text-muted fs-7">typing...</span>
                    </div>
                </div>
                <div class="p-3 rounded bg-light-info">
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Show error message
     */
    function showErrorMessage(message) {
        addMessageToUI({
            type: 'bot',
            message: `<i class="ki-duotone ki-warning fs-2 text-warning me-2"><span class="path1"></span><span class="path2"></span></i>${message}`,
            timestamp: getCurrentTime()
        });
    }

    /**
     * Set typing state
     */
    function setTypingState(typing) {
        isTyping = typing;
        
        if (typing) {
            if (sendBtn) {
                sendBtn.disabled = true;
                sendBtn.classList.add('btn-loading');
            }
            if (messageInput) {
                messageInput.disabled = true;
            }
            quickActions.forEach(btn => btn.disabled = true);
        } else {
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.classList.remove('btn-loading');
            }
            if (messageInput) {
                messageInput.disabled = false;
                messageInput.focus();
            }
            quickActions.forEach(btn => btn.disabled = false);
        }
    }

    /**
     * Show welcome message
     */
    function showWelcomeMessage() {
        // Add some sample quick start messages
        setTimeout(() => {
            if (chatMessages.querySelector('.text-center')) {
                addMessageToUI({
                    type: 'bot',
                    message: 'Hello! I\'m Alex, your friendly AI companion! 😊 I\'m here to chat about anything that interests you - from daily life to big ideas. Just say hi, ask me questions, or tell me what\'s on your mind! 💬',
                    timestamp: getCurrentTime()
                });
            }
        }, 1000);
    }

    /**
     * Remove welcome message
     */
    function removeWelcomeMessage() {
        const welcomeMsg = chatMessages.querySelector('.text-center');
        if (welcomeMsg) {
            welcomeMsg.style.opacity = '0';
            setTimeout(() => {
                if (welcomeMsg.parentNode) {
                    welcomeMsg.remove();
                }
            }, 300);
        }
    }

    /**
     * Scroll to bottom of chat
     */
    function scrollToBottom() {
        setTimeout(() => {
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 100);
    }

    /**
     * Focus input field
     */
    function focusInput() {
        if (messageInput && !isMobileDevice()) {
            messageInput.focus();
        }
    }

    /**
     * Get current time formatted
     */
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    /**
     * Escape HTML characters
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Check if device is mobile
     */
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Handle page visibility change
     */
    function handleVisibilityChange() {
        if (!document.hidden && messageInput) {
            focusInput();
        }
    }

    /**
     * Setup additional event listeners
     */
    function setupAdditionalListeners() {
        // Page visibility
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Window focus
        window.addEventListener('focus', focusInput);
        
        // Prevent form submission on page unload
        window.addEventListener('beforeunload', () => {
            setTypingState(false);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupAdditionalListeners();
        });
    } else {
        init();
        setupAdditionalListeners();
    }

    // Expose some functions globally for debugging
    window.ChatBot = {
        sendMessage,
        addMessageToUI,
        scrollToBottom,
        setTypingState
    };

})();