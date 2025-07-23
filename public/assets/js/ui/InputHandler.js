/**
 * InputHandler Module
 * Manages user input and form interactions
 */

export class InputHandler {
    /**
     * Constructor
     * @param {Object} eventManager - Event manager instance
     */
    constructor(eventManager) {
        this.eventManager = eventManager;
        
        // DOM elements
        this.chatForm = document.getElementById('chat-form');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.quickActions = document.querySelectorAll('.quick-action');
        
        // Bind methods to maintain 'this' context
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleQuickActionClick = this.handleQuickActionClick.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.focusInput = this.focusInput.bind(this);
        this.disableUI = this.disableUI.bind(this);
        this.enableUI = this.enableUI.bind(this);
    }
    
    /**
     * Initialize the input handler
     */
    init() {
        // Set up event listeners
        this.chatForm.addEventListener('submit', this.handleFormSubmit);
        this.messageInput.addEventListener('keypress', this.handleInputKeyPress);
        this.messageInput.addEventListener('input', this.handleInputChange);
        
        // Set up quick action buttons
        this.quickActions.forEach(button => {
            button.addEventListener('click', this.handleQuickActionClick);
        });
        
        // Subscribe to events
        this.eventManager.subscribe('ui:disable', this.disableUI);
        this.eventManager.subscribe('ui:enable', this.enableUI);
        
        // Auto-resize input field
        this.autoResizeInput();
        
        console.log('InputHandler initialized');
    }
    
    /**
     * Handle form submission
     * @param {Event} event - Form submit event
     */
    handleFormSubmit(event) {
        event.preventDefault();
        
        const message = this.messageInput.value.trim();
        if (message) {
            this.eventManager.publish('form:submit', { message });
        }
    }
    
    /**
     * Handle input key press
     * @param {Event} event - Key press event
     */
    handleInputKeyPress(event) {
        // Check if Enter key was pressed without Shift
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.chatForm.dispatchEvent(new Event('submit'));
        }
    }
    
    /**
     * Handle input change
     */
    handleInputChange() {
        this.autoResizeInput();
    }
    
    /**
     * Handle quick action button click
     * @param {Event} event - Click event
     */
    handleQuickActionClick(event) {
        const message = event.currentTarget.dataset.message;
        if (message) {
            this.eventManager.publish('quickAction:click', { message });
        }
    }
    
    /**
     * Clear input field
     */
    clearInput() {
        this.messageInput.value = '';
        this.autoResizeInput();
    }
    
    /**
     * Focus input field
     */
    focusInput() {
        // Only focus on desktop devices
        if (!this.isMobile()) {
            this.messageInput.focus();
        }
    }
    
    /**
     * Auto-resize input field
     */
    autoResizeInput() {
        // Reset height to auto to get correct scrollHeight
        this.messageInput.style.height = 'auto';
        
        // Set height based on scrollHeight (with min and max)
        const newHeight = Math.min(Math.max(this.messageInput.scrollHeight, 38), 150);
        this.messageInput.style.height = `${newHeight}px`;
    }
    
    /**
     * Disable UI elements
     */
    disableUI() {
        this.messageInput.disabled = true;
        this.sendButton.disabled = true;
        
        this.quickActions.forEach(button => {
            button.disabled = true;
        });
    }
    
    /**
     * Enable UI elements
     */
    enableUI() {
        this.messageInput.disabled = false;
        this.sendButton.disabled = false;
        
        this.quickActions.forEach(button => {
            button.disabled = false;
        });
        
        // Focus input field
        this.focusInput();
    }
    
    /**
     * Check if user is on a mobile device
     * @return {boolean} True if mobile device, false otherwise
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}