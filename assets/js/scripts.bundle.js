/**
 * Metronic Scripts Bundle JavaScript
 * Main application scripts and initialization
 */

(function(window, document) {
    'use strict';

    // Main Application Object
    window.KTApp = {
        /**
         * Initialize application
         */
        init: function() {
            this.initComponents();
            this.initLayout();
            this.initScrollspy();
            this.initSmoothScroll();
        },

        /**
         * Initialize components
         */
        initComponents: function() {
            // Initialize cards
            this.initCards();
            
            // Initialize forms
            this.initForms();
            
            // Initialize buttons
            this.initButtons();
            
            // Initialize modals
            this.initModals();
        },

        /**
         * Initialize cards
         */
        initCards: function() {
            var cards = KTUtil.getBySelector('.card');
            
            for (var i = 0; i < cards.length; i++) {
                // Add hover effects
                KTUtil.addEvent(cards[i], 'mouseenter', function() {
                    KTUtil.addClass(this, 'shadow-lg');
                });
                
                KTUtil.addEvent(cards[i], 'mouseleave', function() {
                    KTUtil.removeClass(this, 'shadow-lg');
                });
            }
        },

        /**
         * Initialize forms
         */
        initForms: function() {
            var inputs = KTUtil.getBySelector('.form-control');
            
            for (var i = 0; i < inputs.length; i++) {
                // Add focus effects
                KTUtil.addEvent(inputs[i], 'focus', function() {
                    var parent = this.closest('.form-group') || this.parentElement;
                    KTUtil.addClass(parent, 'focused');
                });
                
                KTUtil.addEvent(inputs[i], 'blur', function() {
                    var parent = this.closest('.form-group') || this.parentElement;
                    KTUtil.removeClass(parent, 'focused');
                });
                
                // Validate on input
                KTUtil.addEvent(inputs[i], 'input', function() {
                    this.validateInput();
                }.bind(this));
            }
        },

        /**
         * Validate input
         */
        validateInput: function(input) {
            if (!input) return;
            
            var isValid = true;
            var value = input.value.trim();
            
            // Required validation
            if (input.hasAttribute('required') && !value) {
                isValid = false;
            }
            
            // Email validation
            if (input.type === 'email' && value) {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
            }
            
            // Update visual state
            if (isValid) {
                KTUtil.removeClass(input, 'is-invalid');
                KTUtil.addClass(input, 'is-valid');
            } else {
                KTUtil.removeClass(input, 'is-valid');
                KTUtil.addClass(input, 'is-invalid');
            }
            
            return isValid;
        },

        /**
         * Initialize buttons
         */
        initButtons: function() {
            var buttons = KTUtil.getBySelector('.btn');
            
            for (var i = 0; i < buttons.length; i++) {
                // Add ripple effect
                KTUtil.addEvent(buttons[i], 'click', function(e) {
                    this.createRipple(e, this);
                }.bind(this));
            }
        },

        /**
         * Create ripple effect
         */
        createRipple: function(event, element) {
            if (!element || typeof element.getBoundingClientRect !== 'function') {
                return;
            }
            
            var circle = document.createElement('span');
            var diameter = Math.max(element.clientWidth, element.clientHeight);
            var radius = diameter / 2;
            
            var rect = element.getBoundingClientRect();
            circle.style.width = circle.style.height = diameter + 'px';
            circle.style.left = (event.clientX - rect.left - radius) + 'px';
            circle.style.top = (event.clientY - rect.top - radius) + 'px';
            circle.classList.add('ripple');
            
            var ripple = element.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }
            
            element.appendChild(circle);
            
            // Add CSS for ripple effect
            if (!document.getElementById('ripple-styles')) {
                var style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    .btn {
                        position: relative;
                        overflow: hidden;
                    }
                    .ripple {
                        position: absolute;
                        border-radius: 50%;
                        background-color: rgba(255, 255, 255, 0.6);
                        transform: scale(0);
                        animation: ripple-animation 0.6s linear;
                        pointer-events: none;
                    }
                    @keyframes ripple-animation {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        },

        /**
         * Initialize modals
         */
        initModals: function() {
            var modalTriggers = KTUtil.getBySelector('[data-bs-toggle="modal"]');
            
            for (var i = 0; i < modalTriggers.length; i++) {
                KTUtil.addEvent(modalTriggers[i], 'click', function(e) {
                    e.preventDefault();
                    var target = this.getAttribute('data-bs-target');
                    if (target) {
                        this.showModal(target);
                    }
                }.bind(this));
            }
        },

        /**
         * Show modal
         */
        showModal: function(selector) {
            var modal = KTUtil.getByTag(selector);
            if (modal) {
                KTUtil.addClass(modal, 'show');
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Close on backdrop click
                KTUtil.addEvent(modal, 'click', function(e) {
                    if (e.target === modal) {
                        this.hideModal(modal);
                    }
                }.bind(this));
                
                // Close on close button click
                var closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
                for (var i = 0; i < closeButtons.length; i++) {
                    KTUtil.addEvent(closeButtons[i], 'click', function() {
                        this.hideModal(modal);
                    }.bind(this));
                }
            }
        },

        /**
         * Hide modal
         */
        hideModal: function(modal) {
            KTUtil.removeClass(modal, 'show');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        },

        /**
         * Initialize layout
         */
        initLayout: function() {
            // Handle responsive behavior
            this.handleResize();
            
            KTUtil.addEvent(window, 'resize', KTUtil.throttle(function() {
                this.handleResize();
            }.bind(this), 250));
        },

        /**
         * Handle window resize
         */
        handleResize: function() {
            var viewport = KTUtil.getViewport();
            
            // Update mobile class
            if (viewport.width < 992) {
                KTUtil.addClass(document.body, 'mobile-view');
            } else {
                KTUtil.removeClass(document.body, 'mobile-view');
            }
            
            // Trigger custom resize event
            KTUtil.triggerEvent(window, 'kt.app.resize', {
                width: viewport.width,
                height: viewport.height
            });
        },

        /**
         * Initialize scrollspy
         */
        initScrollspy: function() {
            var scrollspyElements = KTUtil.getBySelector('[data-kt-scrollspy="true"]');
            
            for (var i = 0; i < scrollspyElements.length; i++) {
                this.initScrollspyElement(scrollspyElements[i]);
            }
        },

        /**
         * Initialize scrollspy element
         */
        initScrollspyElement: function(element) {
            var target = element.getAttribute('data-kt-scrollspy-target');
            var offset = parseInt(element.getAttribute('data-kt-scrollspy-offset')) || 0;
            
            if (target) {
                var targetElement = KTUtil.getByTag(target);
                if (targetElement) {
                    KTUtil.addEvent(window, 'scroll', KTUtil.throttle(function() {
                        this.updateScrollspy(element, targetElement, offset);
                    }.bind(this), 100));
                }
            }
        },

        /**
         * Update scrollspy
         */
        updateScrollspy: function(element, target, offset) {
            if (!target || typeof target.getBoundingClientRect !== 'function') {
                return;
            }
            
            var rect = target.getBoundingClientRect();
            var isVisible = rect.top <= offset && rect.bottom >= offset;
            
            if (isVisible) {
                KTUtil.addClass(element, 'active');
            } else {
                KTUtil.removeClass(element, 'active');
            }
        },

        /**
         * Initialize smooth scroll
         */
        initSmoothScroll: function() {
            var smoothScrollLinks = KTUtil.getBySelector('a[href^="#"]');
            
            for (var i = 0; i < smoothScrollLinks.length; i++) {
                KTUtil.addEvent(smoothScrollLinks[i], 'click', function(e) {
                    var href = this.getAttribute('href');
                    if (href && href !== '#') {
                        var target = KTUtil.getByTag(href);
                        if (target) {
                            e.preventDefault();
                            KTUtil.scrollTo(target, -100, 800);
                        }
                    }
                });
            }
        },

        /**
         * Show loading state
         */
        showLoading: function(element) {
            if (typeof element === 'string') {
                element = KTUtil.getByTag(element);
            }
            
            if (element) {
                KTUtil.addClass(element, 'loading');
                element.setAttribute('data-kt-indicator', 'on');
            }
        },

        /**
         * Hide loading state
         */
        hideLoading: function(element) {
            if (typeof element === 'string') {
                element = KTUtil.getByTag(element);
            }
            
            if (element) {
                KTUtil.removeClass(element, 'loading');
                element.removeAttribute('data-kt-indicator');
            }
        },

        /**
         * Show notification
         */
        showNotification: function(message, type, duration) {
            type = type || 'info';
            duration = duration || 3000;
            
            var notification = document.createElement('div');
            notification.className = 'kt-notification kt-notification-' + type;
            notification.innerHTML = `
                <div class="kt-notification-content">
                    <span class="kt-notification-message">${message}</span>
                    <button class="kt-notification-close" type="button">&times;</button>
                </div>
            `;
            
            // Add styles if not exists
            if (!document.getElementById('notification-styles')) {
                var style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .kt-notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        min-width: 300px;
                        padding: 15px;
                        border-radius: 8px;
                        color: white;
                        z-index: 9999;
                        transform: translateX(100%);
                        transition: transform 0.3s ease;
                    }
                    .kt-notification.show {
                        transform: translateX(0);
                    }
                    .kt-notification-info { background-color: #17a2b8; }
                    .kt-notification-success { background-color: #28a745; }
                    .kt-notification-warning { background-color: #ffc107; color: #212529; }
                    .kt-notification-error { background-color: #dc3545; }
                    .kt-notification-content {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .kt-notification-close {
                        background: none;
                        border: none;
                        color: inherit;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 0;
                        margin-left: 10px;
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(function() {
                KTUtil.addClass(notification, 'show');
            }, 100);
            
            // Auto hide
            setTimeout(function() {
                KTApp.hideNotification(notification);
            }, duration);
            
            // Close button
            var closeBtn = notification.querySelector('.kt-notification-close');
            KTUtil.addEvent(closeBtn, 'click', function() {
                KTApp.hideNotification(notification);
            });
            
            return notification;
        },

        /**
         * Hide notification
         */
        hideNotification: function(notification) {
            KTUtil.removeClass(notification, 'show');
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        },

        /**
         * Get breakpoint
         */
        getBreakpoint: function() {
            var viewport = KTUtil.getViewport();
            
            if (viewport.width < 576) return 'xs';
            if (viewport.width < 768) return 'sm';
            if (viewport.width < 992) return 'md';
            if (viewport.width < 1200) return 'lg';
            if (viewport.width < 1400) return 'xl';
            return 'xxl';
        },

        /**
         * Check if mobile device
         */
        isMobileDevice: function() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }
    };

    // Auto-initialize when DOM is ready
    function domReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    domReady(function() {
        KTApp.init();
    });

    // Expose KTApp globally
    window.KTApp = KTApp;

})(window, document);