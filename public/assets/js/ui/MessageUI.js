/**
 * MessageUI Module
 * Handles the chat interface and message display
 */

import { DOMUtils } from '../utils/DOMUtils.js';
import { TimeUtils } from '../utils/TimeUtils.js';

export class MessageUI {
    /**
     * Constructor
     * @param {Object} eventManager - Event manager instance
     */
    constructor(eventManager) {
        this.eventManager = eventManager;
        
        // DOM elements
        this.chatMessages = document.getElementById('chat-messages');
        this.typingIndicatorTemplate = document.getElementById('typing-indicator-template');
        
        // Bind methods to maintain 'this' context
        this.addUserMessage = this.addUserMessage.bind(this);
        this.addBotMessage = this.addBotMessage.bind(this);
        this.showTypingIndicator = this.showTypingIndicator.bind(this);
        this.hideTypingIndicator = this.hideTypingIndicator.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.clearMessages = this.clearMessages.bind(this);
        this.showWelcomeMessage = this.showWelcomeMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }
    
    /**
     * Initialize the message UI
     */
    init() {
        // Subscribe to events
        this.eventManager.subscribe('bot:typingStarted', () => {
            // Disable UI elements when bot is typing
            this.eventManager.publish('ui:disable');
        });
        
        this.eventManager.subscribe('bot:typingEnded', () => {
            // Enable UI elements when bot is done typing
            this.eventManager.publish('ui:enable');
        });
        
        console.log('MessageUI initialized');
    }
    
    /**
     * Add a user message to the chat
     * @param {string} message - Message text
     */
    addUserMessage(message) {
        // Create message element
        const messageElement = this.createMessageElement({
            content: DOMUtils.escapeHTML(message),
            time: TimeUtils.getCurrentTime(),
            isUser: true
        });
        
        // Add message to chat
        this.chatMessages.appendChild(messageElement);
        
        // Remove welcome message if present
        this.removeWelcomeMessage();
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    /**
     * Add a bot message to the chat
     * @param {string} message - Message text
     */
    addBotMessage(message) {
        // Create message element
        const messageElement = this.createMessageElement({
            content: DOMUtils.escapeHTML(message),
            time: TimeUtils.getCurrentTime(),
            isUser: false
        });
        
        // Add message to chat
        this.chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    /**
     * Create a message element
     * @param {Object} options - Message options
     * @param {string} options.content - Message content
     * @param {string} options.time - Message time
     * @param {boolean} options.isUser - Whether the message is from the user
     * @return {HTMLElement} Message element
     */
    createMessageElement(options) {
        const { content, time, isUser } = options;
        
        // Create message row
        const messageRow = document.createElement('div');
        messageRow.className = `message-row ${isUser ? 'user-message-row' : 'bot-message-row'}`;
        
        // Create message container
        const message = document.createElement('div');
        message.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        // Create message content
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = content;
        
        // Create message time
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = time;
        
        // Assemble message
        message.appendChild(messageContent);
        message.appendChild(messageTime);
        messageRow.appendChild(message);
        
        return messageRow;
    }
    
    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        // Clone typing indicator template
        const typingIndicator = this.typingIndicatorTemplate.firstElementChild.cloneNode(true);
        typingIndicator.id = 'typing-indicator';
        typingIndicator.classList.remove('d-none');
        
        // Add typing indicator to chat
        this.chatMessages.appendChild(typingIndicator);
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    /**
     * Show error message
     */
    showErrorMessage() {
        this.addBotMessage('I\'m sorry, but I\'m having trouble connecting to my AI service. Please try again in a moment.');
    }
    
    /**
     * Clear all messages
     */
    clearMessages() {
        this.chatMessages.innerHTML = '';
    }
    
    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        // Create welcome message container
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        
        // Create welcome icon container
        const welcomeIconContainer = document.createElement('div');
        welcomeIconContainer.className = 'welcome-icon-container';
        
        // Create welcome icon
        const welcomeIcon = document.createElement('i');
        welcomeIcon.className = 'fas fa-robot welcome-icon';
        welcomeIconContainer.appendChild(welcomeIcon);
        
        // Create welcome heading
        const welcomeHeading = document.createElement('h2');
        welcomeHeading.textContent = 'Welcome to Metronic Chatbot!';
        
        // Create welcome text
        const welcomeText = document.createElement('p');
        welcomeText.textContent = 'I\'m Alex, your AI assistant. How can I help you today?';
        
        // Assemble welcome message
        welcomeMessage.appendChild(welcomeIconContainer);
        welcomeMessage.appendChild(welcomeHeading);
        welcomeMessage.appendChild(welcomeText);
        
        // Add welcome message to chat
        this.chatMessages.appendChild(welcomeMessage);
    }
    
    /**
     * Remove welcome message
     */
    removeWelcomeMessage() {
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
    }
    
    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}