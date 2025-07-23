<!-- Chatbot Container -->
<div class="container-fluid p-0 h-100">
    <div class="row g-0 h-100">
        <div class="col-12 col-lg-8 col-xl-6 mx-auto">
            <!-- Chat Card -->
            <div class="card card-custom chat-card h-100">
                <!-- Chat Header -->
                <div class="card-header">
                    <div class="d-flex align-items-center">
                        <div class="symbol symbol-45px me-3 online-status">
                            <img src="<?= asset_url('media/avatars/bot-avatar.png') ?>" alt="Bot Avatar">
                        </div>
                        <div class="d-flex flex-column">
                            <h3 class="card-title mb-0 fs-4 fw-bold">Alex</h3>
                            <span class="text-muted fs-7">AI Assistant</span>
                        </div>
                    </div>
                </div>
                
                <!-- Chat Body -->
                <div class="card-body">
                    <!-- Chat Messages -->
                    <div id="chat-messages" class="chat-messages">
                        <?php if (empty($chatHistory)): ?>
                            <!-- Welcome Message -->
                            <div class="welcome-message">
                                <div class="welcome-icon-container">
                                    <i class="fas fa-robot welcome-icon"></i>
                                </div>
                                <h2>Welcome to Metronic Chatbot!</h2>
                                <p>I'm Alex, your AI assistant. How can I help you today?</p>
                            </div>
                        <?php else: ?>
                            <!-- Chat History -->
                            <?php foreach ($chatHistory as $message): ?>
                                <div class="message-row <?= $message['role'] === 'user' ? 'user-message-row' : 'bot-message-row' ?>">
                                    <div class="message <?= $message['role'] === 'user' ? 'user-message' : 'bot-message' ?>">
                                        <div class="message-content"><?= sanitize_output($message['content']) ?></div>
                                        <div class="message-time"><?= $message['time'] ?></div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Chat Footer -->
                <div class="card-footer">
                    <!-- Quick Actions -->
                    <div class="quick-actions mb-3">
                        <button type="button" class="quick-action" data-message="Hello">👋 Say Hello</button>
                        <button type="button" class="quick-action" data-message="Tell me about yourself">🤖 About You</button>
                        <button type="button" class="quick-action" data-message="What can we talk about?">💬 Topics</button>
                        <button type="button" class="quick-action" data-message="Tell me something interesting">✨ Surprise Me</button>
                    </div>
                    
                    <!-- Chat Input -->
                    <form id="chat-form" class="chat-input-container">
                        <textarea id="message-input" class="form-control" placeholder="Type your message here..." rows="1"></textarea>
                        <button type="submit" id="send-button" class="btn btn-primary btn-icon">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Typing Indicator Template (Hidden) -->
<div id="typing-indicator-template" class="d-none">
    <div class="message-row bot-message-row">
        <div class="message bot-message typing-indicator">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
</div>