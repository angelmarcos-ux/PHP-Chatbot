/**
 * APIClient Module
 * Handles API communication with the server
 */

export class APIClient {
    /**
     * Constructor
     * @param {Object} eventManager - Event manager instance
     */
    constructor(eventManager) {
        this.eventManager = eventManager;
        
        // API endpoints
        this.endpoints = {
            sendMessage: '/send-message',
            clearChat: '/clear-chat'
        };
    }
    
    /**
     * Send a message to the API
     * @param {string} message - Message text
     * @return {Promise} Promise that resolves with the API response
     */
    async sendMessage(message) {
        try {
            const response = await this.post(this.endpoints.sendMessage, { message });
            return response;
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    }
    
    /**
     * Clear chat history
     * @return {Promise} Promise that resolves with the API response
     */
    async clearChat() {
        try {
            const response = await this.post(this.endpoints.clearChat, {});
            return response;
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    }
    
    /**
     * Make a POST request to the API
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @return {Promise} Promise that resolves with the API response
     */
    async post(endpoint, data) {
        try {
            // Publish API request started event
            this.eventManager.publish('api:requestStarted', { endpoint });
            
            // Make the request
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            });
            
            // Check if response is ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error ${response.status}`);
            }
            
            // Parse response
            const responseData = await response.json();
            
            // Publish API request ended event
            this.eventManager.publish('api:requestEnded', { endpoint, success: true });
            
            return responseData;
        } catch (error) {
            // Publish API request ended event with error
            this.eventManager.publish('api:requestEnded', { endpoint, success: false, error });
            
            throw error;
        }
    }
}