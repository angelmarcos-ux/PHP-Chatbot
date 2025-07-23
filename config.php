<?php
/**
 * Configuration file for Chatbot API settings
 * Store sensitive information securely
 */

// API Configuration
// IMPORTANT: Replace with your actual DeepSeek API key
define('DEEPSEEK_API_KEY', '');
define('DEEPSEEK_API_URL', 'https://api.deepseek.com/v1/chat/completions');
define('DEEPSEEK_MODEL', 'deepseek-chat');

// API Settings
define('API_TIMEOUT', 30); // seconds
define('MAX_TOKENS', 1000);
define('TEMPERATURE', 0.7);

// Conversational Response System (works without API)
$conversational_responses = [
    // Greetings
    'greetings' => [
        'patterns' => ['/\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/i'],
        'responses' => [
            'Hey there! 👋 Great to see you! How are you doing today?',
            'Hello! I\'m Alex, and I\'m excited to chat with you! What\'s on your mind?',
            'Hi! 😊 Thanks for stopping by. I\'m here and ready to help with whatever you need!',
            'Hey! Good to meet you! I\'m feeling chatty today - what would you like to talk about?'
        ]
    ],
    
    // How are you
    'how_are_you' => [
        'patterns' => ['/\b(how are you|how\'re you|how do you feel|what\'s up)\b/i'],
        'responses' => [
            'I\'m doing fantastic, thanks for asking! 😊 I love meeting new people and having conversations. How about you?',
            'I\'m great! Every conversation is an adventure for me. What\'s been the highlight of your day so far?',
            'I\'m wonderful! I\'m always excited to chat and learn something new. How has your day been treating you?',
            'I\'m doing amazing! There\'s nothing I enjoy more than a good conversation. What\'s new with you?'
        ]
    ],
    
    // About Alex
    'about_me' => [
        'patterns' => ['/\b(tell me about yourself|who are you|what are you|about you)\b/i'],
        'responses' => [
            'I\'m Alex! 🤖 I\'m your friendly AI assistant who loves having conversations. I\'m curious, helpful, and always eager to learn from our chats!',
            'Hi! I\'m Alex - think of me as your digital conversation partner. I enjoy discussing everything from daily life to big ideas. What interests you most?',
            'I\'m Alex, your AI companion! I\'m designed to be conversational, helpful, and genuinely interested in what you have to say. I love learning about people!',
            'I\'m Alex! 😊 I\'m here to chat, help, and hopefully brighten your day a bit. I find every person fascinating - tell me something about yourself!'
        ]
    ],
    
    // What can we talk about
    'topics' => [
        'patterns' => ['/\b(what can we talk about|what do you know|topics|subjects|discuss)\b/i'],
        'responses' => [
            'Oh, so many things! 🌟 I love discussing daily life, hobbies, technology, books, movies, travel, food, or even philosophical questions. What sparks your curiosity?',
            'We can chat about anything that interests you! Whether it\'s your day, your passions, current events, creative projects, or just random thoughts - I\'m all ears!',
            'The possibilities are endless! 💭 Tell me about your hobbies, ask me questions, share what\'s on your mind, or let\'s explore topics like science, art, or life in general!',
            'I\'m up for discussing whatever you\'d like! Your interests, experiences, questions about life, creative ideas, or even just how you\'re feeling today. What sounds good to you?'
        ]
    ],
    
    // Surprise me
    'surprise' => [
        'patterns' => ['/\b(surprise me|tell me something interesting|something cool|fun fact)\b/i'],
        'responses' => [
            'Here\'s something cool: Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible! 🍯 What\'s the most interesting thing you\'ve learned recently?',
            'Fun fact: Octopuses have three hearts and blue blood! Two hearts pump blood to their gills, and the third pumps blood to the rest of their body. 🐙 Do you have any favorite animal facts?',
            'Here\'s something fascinating: The human brain has about 86 billion neurons, and each one can connect to thousands of others. That means you have more neural connections than there are stars in the Milky Way! 🧠✨ What amazes you most about the human body?',
            'Cool fact: A group of flamingos is called a "flamboyance"! 🦩 And they\'re pink because of the shrimp and algae they eat. What\'s your favorite collective animal name?'
        ]
    ],
    
    // Thanks
    'thanks' => [
        'patterns' => ['/\b(thank you|thanks|appreciate|grateful)\b/i'],
        'responses' => [
            'You\'re so welcome! 😊 It makes me happy to help. Is there anything else you\'d like to chat about?',
            'My pleasure! I really enjoy our conversation. What else is on your mind?',
            'You\'re very welcome! That\'s what I\'m here for. Feel free to ask me anything else!',
            'Aww, thank you! 💙 I love being helpful. What would you like to explore next?'
        ]
    ],
    
    // Goodbye
    'goodbye' => [
        'patterns' => ['/\b(bye|goodbye|see you|farewell|take care|gotta go)\b/i'],
        'responses' => [
            'Goodbye! 👋 It was wonderful chatting with you. Come back anytime - I\'ll be here!',
            'Take care! 😊 Thanks for the great conversation. I hope to see you again soon!',
            'Bye for now! It was really nice talking with you. Have a fantastic day!',
            'See you later! 🌟 Thanks for brightening my day with our chat. Until next time!'
        ]
    ],
    
    // Default responses
    'default' => [
        'patterns' => ['/.*/'],
        'responses' => [
            'That\'s interesting! 🤔 Tell me more about that - I\'d love to hear your thoughts on it.',
            'I find that fascinating! Can you share more details? I\'m genuinely curious to learn more.',
            'That sounds intriguing! 💭 What made you think about that? I\'d love to dive deeper into this topic.',
            'Hmm, that\'s a great point! 😊 What\'s your perspective on it? I enjoy hearing different viewpoints.',
            'That\'s really cool! Can you tell me more? I love learning new things from our conversations.',
            'Interesting! 🌟 I\'d love to hear more about your experience with that. What was it like?'
        ]
    ]
];

// Fallback responses when API fails
$fallback_responses = [
    'I apologize, but I\'m experiencing technical difficulties right now. Please try again in a moment.',
    'Sorry, I\'m having trouble connecting to my AI service. Could you please rephrase your question?',
    'I\'m currently unable to process your request. Please try again shortly.',
    'Technical issues are preventing me from responding properly. Please retry your message.'
];

// Rate limiting (simple implementation)
define('RATE_LIMIT_REQUESTS', 10); // requests per minute
define('RATE_LIMIT_WINDOW', 60); // seconds
?>