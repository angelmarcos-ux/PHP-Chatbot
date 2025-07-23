/**
 * ConversationalPatterns Module
 * Handles local response generation based on predefined patterns
 */

export class ConversationalPatterns {
    /**
     * Constructor
     */
    constructor() {
        // Predefined conversational patterns
        this.patterns = {
            // Greetings
            greetings: {
                patterns: [/\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/i],
                responses: [
                    'Hey there! 👋 Great to see you! How are you doing today?',
                    'Hello! I\'m Alex, and I\'m excited to chat with you! What\'s on your mind?',
                    'Hi! 😊 Thanks for stopping by. I\'m here and ready to help with whatever you need!',
                    'Hey! Good to meet you! I\'m feeling chatty today - what would you like to talk about?'
                ]
            },
            
            // How are you
            how_are_you: {
                patterns: [/\b(how are you|how\'re you|how do you feel|what\'s up)\b/i],
                responses: [
                    'I\'m doing fantastic, thanks for asking! 😊 I love meeting new people and having conversations. How about you?',
                    'I\'m great! Every conversation is an adventure for me. What\'s been the highlight of your day so far?',
                    'I\'m wonderful! I\'m always excited to chat and learn something new. How has your day been treating you?',
                    'I\'m doing amazing! There\'s nothing I enjoy more than a good conversation. What\'s new with you?'
                ]
            },
            
            // About Alex
            about_me: {
                patterns: [/\b(tell me about yourself|who are you|what are you|about you)\b/i],
                responses: [
                    'I\'m Alex! 🤖 I\'m your friendly AI assistant who loves having conversations. I\'m curious, helpful, and always eager to learn from our chats!',
                    'Hi! I\'m Alex - think of me as your digital conversation partner. I enjoy discussing everything from daily life to big ideas. What interests you most?',
                    'I\'m Alex, your AI companion! I\'m designed to be conversational, helpful, and genuinely interested in what you have to say. I love learning about people!',
                    'I\'m Alex! 😊 I\'m here to chat, help, and hopefully brighten your day a bit. I find every person fascinating - tell me something about yourself!'
                ]
            },
            
            // What can we talk about
            topics: {
                patterns: [/\b(what can we talk about|what do you know|topics|subjects|discuss)\b/i],
                responses: [
                    'Oh, so many things! 🌟 I love discussing daily life, hobbies, technology, books, movies, travel, food, or even philosophical questions. What sparks your curiosity?',
                    'We can chat about anything that interests you! Whether it\'s your day, your passions, current events, creative projects, or just random thoughts - I\'m all ears!',
                    'The possibilities are endless! 💭 Tell me about your hobbies, ask me questions, share what\'s on your mind, or let\'s explore topics like science, art, or life in general!',
                    'I\'m up for discussing whatever you\'d like! Your interests, experiences, questions about life, creative ideas, or even just how you\'re feeling today. What sounds good to you?'
                ]
            },
            
            // Surprise me
            surprise: {
                patterns: [/\b(surprise me|tell me something interesting|something cool|fun fact)\b/i],
                responses: [
                    'Here\'s something cool: Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible! 🍯 What\'s the most interesting thing you\'ve learned recently?',
                    'Fun fact: Octopuses have three hearts and blue blood! Two hearts pump blood to their gills, and the third pumps blood to the rest of their body. 🐙 Do you have any favorite animal facts?',
                    'Here\'s something fascinating: The human brain has about 86 billion neurons, and each one can connect to thousands of others. That means you have more neural connections than there are stars in the Milky Way! 🧠✨ What amazes you most about the human body?',
                    'Cool fact: A group of flamingos is called a "flamboyance"! 🦩 And they\'re pink because of the shrimp and algae they eat. What\'s your favorite collective animal name?'
                ]
            },
            
            // Thanks
            thanks: {
                patterns: [/\b(thank you|thanks|appreciate|grateful)\b/i],
                responses: [
                    'You\'re so welcome! 😊 It makes me happy to help. Is there anything else you\'d like to chat about?',
                    'My pleasure! I really enjoy our conversation. What else is on your mind?',
                    'You\'re very welcome! That\'s what I\'m here for. Feel free to ask me anything else!',
                    'Aww, thank you! 💙 I love being helpful. What would you like to explore next?'
                ]
            },
            
            // Goodbye
            goodbye: {
                patterns: [/\b(bye|goodbye|see you|farewell|take care|gotta go)\b/i],
                responses: [
                    'Goodbye! 👋 It was wonderful chatting with you. Come back anytime - I\'ll be here!',
                    'Take care! 😊 Thanks for the great conversation. I hope to see you again soon!',
                    'Bye for now! It was really nice talking with you. Have a fantastic day!',
                    'See you later! 🌟 Thanks for brightening my day with our chat. Until next time!'
                ]
            },
            
            // Default responses
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
    }
    
    /**
     * Get a response based on the input message
     * @param {string} message - Input message
     * @return {string|null} Response or null if no match
     */
    getResponse(message) {
        // Check each intent
        for (const intent in this.patterns) {
            // Skip default intent for now
            if (intent === 'default') continue;
            
            const { patterns, responses } = this.patterns[intent];
            
            // Check if message matches any pattern
            if (this.matchesPatterns(message, patterns)) {
                // Return a random response
                return this.getRandomItem(responses);
            }
        }
        
        // Return null to indicate no match (will use API instead)
        return null;
    }
    
    /**
     * Check if a message matches any pattern in an array
     * @param {string} message - Message to check
     * @param {Array} patterns - Array of regex patterns
     * @return {boolean} True if matches any pattern, false otherwise
     */
    matchesPatterns(message, patterns) {
        for (const pattern of patterns) {
            if (pattern.test(message)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get a random item from an array
     * @param {Array} array - Array to get random item from
     * @return {*} Random item
     */
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}