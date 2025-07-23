/**
 * Metronic Plugins Bundle JavaScript
 * Essential JavaScript functionality for the chatbot interface
 */

(function(window, document) {
    'use strict';

    // Utility Functions
    window.KTUtil = {
        /**
         * Get element by ID or return the element if already an element
         */
        getById: function(id) {
            if (typeof id === 'string') {
                return document.getElementById(id);
            }
            return id;
        },

        /**
         * Get elements by selector
         */
        getBySelector: function(selector, parent) {
            parent = parent || document;
            return parent.querySelectorAll(selector);
        },

        /**
         * Get single element by selector
         */
        getByTag: function(selector, parent) {
            parent = parent || document;
            return parent.querySelector(selector);
        },

        /**
         * Add event listener
         */
        addEvent: function(element, event, handler) {
            if (element.addEventListener) {
                element.addEventListener(event, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + event, handler);
            }
        },

        /**
         * Remove event listener
         */
        removeEvent: function(element, event, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(event, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent('on' + event, handler);
            }
        },

        /**
         * Trigger custom event
         */
        triggerEvent: function(element, eventName, data) {
            var event;
            data = data || {};
            
            if (window.CustomEvent) {
                event = new CustomEvent(eventName, {
                    detail: data,
                    bubbles: true,
                    cancelable: true
                });
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
            }
            
            element.dispatchEvent(event);
        },

        /**
         * Check if element has class
         */
        hasClass: function(element, className) {
            if (element.classList) {
                return element.classList.contains(className);
            }
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        },

        /**
         * Add class to element
         */
        addClass: function(element, className) {
            if (element.classList) {
                element.classList.add(className);
            } else {
                element.className += ' ' + className;
            }
        },

        /**
         * Remove class from element
         */
        removeClass: function(element, className) {
            if (element.classList) {
                element.classList.remove(className);
            } else {
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        },

        /**
         * Toggle class on element
         */
        toggleClass: function(element, className) {
            if (this.hasClass(element, className)) {
                this.removeClass(element, className);
            } else {
                this.addClass(element, className);
            }
        },

        /**
         * Get element attribute
         */
        attr: function(element, name, value) {
            if (value !== undefined) {
                element.setAttribute(name, value);
            } else {
                return element.getAttribute(name);
            }
        },

        /**
         * Remove element attribute
         */
        removeAttr: function(element, name) {
            element.removeAttribute(name);
        },

        /**
         * Animate element
         */
        animate: function(element, properties, duration, callback) {
            duration = duration || 300;
            var start = performance.now();
            var startValues = {};
            
            // Get initial values
            for (var prop in properties) {
                if (properties.hasOwnProperty(prop)) {
                    startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
                }
            }
            
            function step(timestamp) {
                var progress = Math.min((timestamp - start) / duration, 1);
                
                for (var prop in properties) {
                    if (properties.hasOwnProperty(prop)) {
                        var value = startValues[prop] + (properties[prop] - startValues[prop]) * progress;
                        element.style[prop] = value + (prop === 'opacity' ? '' : 'px');
                    }
                }
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else if (callback) {
                    callback();
                }
            }
            
            requestAnimationFrame(step);
        },

        /**
         * Fade in element
         */
        fadeIn: function(element, duration, callback) {
            element.style.opacity = '0';
            element.style.display = 'block';
            this.animate(element, { opacity: 1 }, duration, callback);
        },

        /**
         * Fade out element
         */
        fadeOut: function(element, duration, callback) {
            this.animate(element, { opacity: 0 }, duration, function() {
                element.style.display = 'none';
                if (callback) callback();
            });
        },

        /**
         * Slide down element
         */
        slideDown: function(element, duration, callback) {
            element.style.height = '0px';
            element.style.overflow = 'hidden';
            element.style.display = 'block';
            var height = element.scrollHeight;
            this.animate(element, { height: height }, duration, function() {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
                if (callback) callback();
            });
        },

        /**
         * Slide up element
         */
        slideUp: function(element, duration, callback) {
            var height = element.offsetHeight;
            element.style.overflow = 'hidden';
            this.animate(element, { height: 0 }, duration, function() {
                element.style.display = 'none';
                element.style.height = height + 'px';
                element.style.overflow = 'visible';
                if (callback) callback();
            });
        },

        /**
         * Get viewport dimensions
         */
        getViewport: function() {
            return {
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            };
        },

        /**
         * Check if element is in viewport
         */
        isInViewport: function(element) {
            if (!element || typeof element.getBoundingClientRect !== 'function') {
                return false;
            }
            
            var rect = element.getBoundingClientRect();
            var viewport = this.getViewport();
            
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= viewport.height &&
                rect.right <= viewport.width
            );
        },

        /**
         * Scroll to element
         */
        scrollTo: function(element, offset, duration) {
            offset = offset || 0;
            duration = duration || 500;
            
            var targetPosition = element.offsetTop + offset;
            var startPosition = window.pageYOffset;
            var distance = targetPosition - startPosition;
            var startTime = null;
            
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                var timeElapsed = currentTime - startTime;
                var run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
        },

        /**
         * Debounce function
         */
        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        /**
         * Throttle function
         */
        throttle: function(func, limit) {
            var inThrottle;
            return function() {
                var args = arguments;
                var context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(function() { inThrottle = false; }, limit);
                }
            };
        },

        /**
         * Generate unique ID
         */
        getUniqueId: function(prefix) {
            prefix = prefix || 'kt';
            return prefix + '_' + Math.random().toString(36).substr(2, 9);
        },

        /**
         * Deep merge objects
         */
        deepMerge: function(target, source) {
            var output = Object.assign({}, target);
            if (this.isObject(target) && this.isObject(source)) {
                Object.keys(source).forEach(function(key) {
                    if (KTUtil.isObject(source[key])) {
                        if (!(key in target)) {
                            Object.assign(output, { [key]: source[key] });
                        } else {
                            output[key] = KTUtil.deepMerge(target[key], source[key]);
                        }
                    } else {
                        Object.assign(output, { [key]: source[key] });
                    }
                });
            }
            return output;
        },

        /**
         * Check if value is object
         */
        isObject: function(item) {
            return item && typeof item === 'object' && !Array.isArray(item);
        },

        /**
         * Format number with commas
         */
        numberFormat: function(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        /**
         * Get random number between min and max
         */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    // Initialize on DOM ready
    function domReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // Auto-initialize components
    domReady(function() {
        // Initialize tooltips if any
        var tooltips = KTUtil.getBySelector('[data-bs-toggle="tooltip"]');
        for (var i = 0; i < tooltips.length; i++) {
            // Basic tooltip functionality
            KTUtil.addEvent(tooltips[i], 'mouseenter', function() {
                var title = this.getAttribute('title') || this.getAttribute('data-bs-title');
                if (title) {
                    this.setAttribute('data-original-title', title);
                    this.removeAttribute('title');
                }
            });
        }

        // Initialize dropdowns if any
        var dropdowns = KTUtil.getBySelector('[data-bs-toggle="dropdown"]');
        for (var j = 0; j < dropdowns.length; j++) {
            KTUtil.addEvent(dropdowns[j], 'click', function(e) {
                e.preventDefault();
                var target = this.getAttribute('data-bs-target') || this.getAttribute('href');
                if (target) {
                    var dropdown = KTUtil.getByTag(target);
                    if (dropdown) {
                        KTUtil.toggleClass(dropdown, 'show');
                    }
                }
            });
        }

        // Close dropdowns when clicking outside
        KTUtil.addEvent(document, 'click', function(e) {
            var dropdowns = KTUtil.getBySelector('.dropdown-menu.show');
            for (var k = 0; k < dropdowns.length; k++) {
                if (!dropdowns[k].contains(e.target)) {
                    KTUtil.removeClass(dropdowns[k], 'show');
                }
            }
        });
    });

    // Expose KTUtil globally
    window.KTUtil = KTUtil;

})(window, document);