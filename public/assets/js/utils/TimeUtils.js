/**
 * TimeUtils Module
 * Utility functions for time and date operations
 */

export class TimeUtils {
    /**
     * Get current time in HH:MM format
     * @return {string} Current time
     */
    static getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    
    /**
     * Get current date in YYYY-MM-DD format
     * @return {string} Current date
     */
    static getCurrentDate() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }
    
    /**
     * Get current date and time in YYYY-MM-DD HH:MM:SS format
     * @return {string} Current date and time
     */
    static getCurrentDateTime() {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0];
        return `${date} ${time}`;
    }
    
    /**
     * Format a date object
     * @param {Date} date - Date object
     * @param {string} format - Format string
     * @return {string} Formatted date
     */
    static formatDate(date, format = 'YYYY-MM-DD') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }
    
    /**
     * Get relative time (e.g. "2 minutes ago")
     * @param {Date|string} date - Date object or ISO string
     * @return {string} Relative time
     */
    static getRelativeTime(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // Difference in seconds
        
        if (diff < 60) {
            return 'just now';
        } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diff < 2592000) {
            const days = Math.floor(diff / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (diff < 31536000) {
            const months = Math.floor(diff / 2592000);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diff / 31536000);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    }
    
    /**
     * Calculate time difference between two dates
     * @param {Date} date1 - First date
     * @param {Date} date2 - Second date
     * @return {Object} Time difference in milliseconds, seconds, minutes, hours, days
     */
    static getTimeDifference(date1, date2) {
        const diff = Math.abs(date2 - date1); // Difference in milliseconds
        
        return {
            milliseconds: diff,
            seconds: Math.floor(diff / 1000),
            minutes: Math.floor(diff / 60000),
            hours: Math.floor(diff / 3600000),
            days: Math.floor(diff / 86400000)
        };
    }
    
    /**
     * Check if a date is today
     * @param {Date} date - Date to check
     * @return {boolean} True if date is today
     */
    static isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    /**
     * Add time to a date
     * @param {Date} date - Date to add time to
     * @param {number} amount - Amount to add
     * @param {string} unit - Unit of time (milliseconds, seconds, minutes, hours, days)
     * @return {Date} New date
     */
    static addTime(date, amount, unit = 'days') {
        const newDate = new Date(date);
        
        switch (unit) {
            case 'milliseconds':
                newDate.setMilliseconds(date.getMilliseconds() + amount);
                break;
            case 'seconds':
                newDate.setSeconds(date.getSeconds() + amount);
                break;
            case 'minutes':
                newDate.setMinutes(date.getMinutes() + amount);
                break;
            case 'hours':
                newDate.setHours(date.getHours() + amount);
                break;
            case 'days':
                newDate.setDate(date.getDate() + amount);
                break;
            case 'months':
                newDate.setMonth(date.getMonth() + amount);
                break;
            case 'years':
                newDate.setFullYear(date.getFullYear() + amount);
                break;
            default:
                throw new Error(`Invalid unit: ${unit}`);
        }
        
        return newDate;
    }
}