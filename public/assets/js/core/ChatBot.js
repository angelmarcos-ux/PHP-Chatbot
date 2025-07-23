/**
 * ChatBot Core Module
 * Main controller for the chatbot functionality
 */

export class ChatBot {
    /**
     * Constructor
     * @param {Object} dependencies - Dependency injection object
     */
    constructor(dependencies) {
        // Store dependencies
        this.eventManager = dependencies.eventManager;
        this.messageUI = dependencies.messageUI;
        this.apiClient = dependencies.apiClient;
        this.conversationalPatterns = dependencies.conversationalPatterns;
        this.inputHandler = dependencies.inputHandler;
        
        // State variables
        this.isTyping = false;
        this.isMobile = this.detectMobile();
        
        // Bind methods to maintain 'this' context
        this.sendMessage = this.sendMessage.bind(this);
        this.handleQuickAction = this.handleQuickAction.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleWindowFocus = this.handleWindowFocus.bind(this);
        this.clearChat = this.clearChat.bind(this);
    }
    
    /**
     * Initialize the chatbot
     */
    init() {
        // Subscribe to events
        this.eventManager.subscribe('form:submit', this.sendMessage);
        this.eventManager.subscribe('quickAction:click', this.handleQuickAction);
        this.eventManager.subscribe('chat:clear', this.clearChat);
        
        // Set up page visibility and focus events
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        window.addEventListener('focus', this.handleWindowFocus);
        
        // Prevent form submission on page unload
        window.addEventListener('beforeunload', () => {
            if (this.isTyping) {
                return 'The bot is still typing. Are you sure you want to leave?';
            }
        });
        
        // Initialize UI components
        this.messageUI.init();
        this.inputHandler.init();
        
        // Focus input field
        this.inputHandler.focusInput();
        
        console.log('Chatbot initialized');
    }
    
    /**
     * Send a message
     * @param {Object} data - Message data
     */
    async sendMessage(data) {
        const message = data.message.trim();
        
        // Don't send empty messages
        if (!message) return;
        
        // Don't allow sending while bot is typing
        if (this.isTyping) return;
        
        // Set typing state
        this.isTyping = true;
        this.eventManager.publish('bot:typingStarted');
        
        // Clear input field
        this.inputHandler.clearInput();
        
        // Add user message to UI
        this.messageUI.addUserMessage(message);
        
        // Show typing indicator
        this.messageUI.showTypingIndicator();
        
        try {
            // Try to get a local response first
            const localResponse = this.conversationalPatterns.getResponse(message);
            
            if (localResponse) {
                // Simulate typing delay for local responses
                const typingDelay = Math.min(1000 + message.length * 20, 3000);
                
                setTimeout(() => {
                    // Hide typing indicator
                    this.messageUI.hideTypingIndicator();
                    
                    // Add bot message to UI
                    this.messageUI.addBotMessage(localResponse);
                    
                    // Reset typing state
                    this.isTyping = false;
                    this.eventManager.publish('bot:typingEnded');
                    
                    // Focus input field
                    this.inputHandler.focusInput();
                }, typingDelay);
            } else {
                // If no local response, use API
                const response = await this.apiClient.sendMessage(message);
                
                // Hide typing indicator
                this.messageUI.hideTypingIndicator();
                
                // Add bot message to UI
                this.messageUI.addBotMessage(response.response);
                
                // Reset typing state
                this.isTyping = false;
                this.eventManager.publish('bot:typingEnded');
                
                // Focus input field
                this.inputHandler.focusInput();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Hide typing indicator
            this.messageUI.hideTypingIndicator();
            
            // Show error message
            this.messageUI.showErrorMessage();
            
            // Reset typing state
            this.isTyping = false;
            this.eventManager.publish('bot:typingEnded');
            
            // Focus input field
            this.inputHandler.focusInput();
        }
    }
    
    /**
     * Handle quick action button click
     * @param {Object} data - Quick action data
     */
    handleQuickAction(data) {
        // Don't allow quick actions while bot is typing
        if (this.isTyping) return;
        
        // Send the quick action message
        this.sendMessage({ message: data.message });
    }
    
    /**
     * Handle page visibility change
     */
    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // Focus input field when page becomes visible
            this.inputHandler.focusInput();
        }
    }
    
    /**
     * Handle window focus
     */
    handleWindowFocus() {
        // Focus input field when window gets focus
        this.inputHandler.focusInput();
    }
    
    /**
     * Clear chat history
     */
    async clearChat() {
        try {
            // Call API to clear chat
            await this.apiClient.clearChat();
            
            // Clear UI
            this.messageUI.clearMessages();
            this.messageUI.showWelcomeMessage();
            
            // Focus input field
            this.inputHandler.focusInput();
        } catch (error) {
            console.error('Error clearing chat:', error);
        }
    }
    
    /**
     * Detect if user is on a mobile device
     * @return {boolean} True if mobile device, false otherwise
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}