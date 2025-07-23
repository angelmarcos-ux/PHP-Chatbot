/**
 * DOMUtils Module
 * Utility functions for DOM manipulation
 */

export class DOMUtils {
    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @return {string} Escaped text
     */
    static escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Create an element with attributes and children
     * @param {string} tag - Element tag name
     * @param {Object} attributes - Element attributes
     * @param {Array|string|Node} children - Element children
     * @return {HTMLElement} Created element
     */
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.entries(value).forEach(([prop, val]) => {
                    element.style[prop] = val;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Add children
        if (children) {
            if (!Array.isArray(children)) {
                children = [children];
            }
            
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
        }
        
        return element;
    }
    
    /**
     * Add a class to an element
     * @param {HTMLElement} element - Element to add class to
     * @param {string} className - Class name to add
     */
    static addClass(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    }
    
    /**
     * Remove a class from an element
     * @param {HTMLElement} element - Element to remove class from
     * @param {string} className - Class name to remove
     */
    static removeClass(element, className) {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(
                new RegExp('(^|\\s)' + className + '(\\s|$)', 'g'), ' '
            ).trim();
        }
    }
    
    /**
     * Toggle a class on an element
     * @param {HTMLElement} element - Element to toggle class on
     * @param {string} className - Class name to toggle
     */
    static toggleClass(element, className) {
        if (element.classList) {
            element.classList.toggle(className);
        } else {
            if (this.hasClass(element, className)) {
                this.removeClass(element, className);
            } else {
                this.addClass(element, className);
            }
        }
    }
    
    /**
     * Check if an element has a class
     * @param {HTMLElement} element - Element to check
     * @param {string} className - Class name to check for
     * @return {boolean} True if element has class
     */
    static hasClass(element, className) {
        if (element.classList) {
            return element.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
    }
    
    /**
     * Get element by ID
     * @param {string} id - Element ID
     * @return {HTMLElement} Element with ID
     */
    static getById(id) {
        return document.getElementById(id);
    }
    
    /**
     * Get elements by class name
     * @param {string} className - Class name
     * @param {HTMLElement} parent - Parent element to search in
     * @return {HTMLCollection} Elements with class name
     */
    static getByClass(className, parent = document) {
        return parent.getElementsByClassName(className);
    }
    
    /**
     * Get elements by tag name
     * @param {string} tagName - Tag name
     * @param {HTMLElement} parent - Parent element to search in
     * @return {HTMLCollection} Elements with tag name
     */
    static getByTag(tagName, parent = document) {
        return parent.getElementsByTagName(tagName);
    }
    
    /**
     * Get elements by selector
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element to search in
     * @return {NodeList} Elements matching selector
     */
    static getBySelector(selector, parent = document) {
        return parent.querySelectorAll(selector);
    }
    
    /**
     * Get first element by selector
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element to search in
     * @return {HTMLElement} First element matching selector
     */
    static getFirstBySelector(selector, parent = document) {
        return parent.querySelector(selector);
    }
    
    /**
     * Add event listener
     * @param {HTMLElement} element - Element to add listener to
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static addEvent(element, event, handler, useCapture = false) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, handler);
        }
    }
    
    /**
     * Remove event listener
     * @param {HTMLElement} element - Element to remove listener from
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {boolean} useCapture - Use capture phase
     */
    static removeEvent(element, event, handler, useCapture = false) {
        if (element.removeEventListener) {
            element.removeEventListener(event, handler, useCapture);
        } else if (element.detachEvent) {
            element.detachEvent('on' + event, handler);
        }
    }
    
    /**
     * Check if device is mobile
     * @return {boolean} True if device is mobile
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * Get viewport dimensions
     * @return {Object} Viewport width and height
     */
    static getViewport() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        };
    }
}