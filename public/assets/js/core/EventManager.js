/**
 * EventManager Module
 * Implements the Observer pattern for event-based communication
 */

export class EventManager {
    /**
     * Constructor
     */
    constructor() {
        this.events = {};
    }
    
    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @return {Object} Subscription object with unsubscribe method
     */
    subscribe(event, callback) {
        // Create event array if it doesn't exist
        if (!this.events[event]) {
            this.events[event] = [];
        }
        
        // Add callback to event array
        this.events[event].push(callback);
        
        // Return subscription object
        return {
            unsubscribe: () => this.unsubscribe(event, callback)
        };
    }
    
    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    unsubscribe(event, callback) {
        // Return if event doesn't exist
        if (!this.events[event]) return;
        
        // Filter out the callback
        this.events[event] = this.events[event].filter(cb => cb !== callback);
        
        // Remove event if no callbacks left
        if (this.events[event].length === 0) {
            delete this.events[event];
        }
    }
    
    /**
     * Publish an event
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    publish(event, data = {}) {
        // Return if event doesn't exist
        if (!this.events[event]) return;
        
        // Call all callbacks with data
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event ${event} callback:`, error);
            }
        });
    }
    
    /**
     * Clear all events
     */
    clear() {
        this.events = {};
    }
    
    /**
     * Get all events (for debugging)
     * @return {Object} Events object
     */
    getEvents() {
        return this.events;
    }
}