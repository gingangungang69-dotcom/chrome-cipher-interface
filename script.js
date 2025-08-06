// Chat functionality
let chatHistory = [];
let currentChatId = null;
let isLoading = false;

// DOM elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.getElementById('mainContent');
const newChatBtn = document.getElementById('newChatBtn');
const chatList = document.getElementById('chatList');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const loadingMessage = document.getElementById('loadingMessage');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set current time for initial message
    document.getElementById('currentTime').textContent = formatTime(new Date());
    
    // Load chat history from localStorage
    loadChatHistory();
    
    // Event listeners
    sidebarToggle.addEventListener('click', toggleSidebar);
    newChatBtn.addEventListener('click', startNewChat);
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('input', adjustTextareaHeight);
    messageInput.addEventListener('keydown', handleKeyDown);
    
    // Auto-resize textarea
    adjustTextareaHeight();
});

// Sidebar functionality
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    
    // On mobile, use different behavior
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
    }
}

// Chat management
function startNewChat() {
    currentChatId = generateChatId();
    messages.innerHTML = getInitialMessage();
    messageInput.value = '';
    messageInput.focus();
    
    // Add to chat history
    const newChat = {
        id: currentChatId,
        title: 'New Chat',
        messages: [],
        createdAt: new Date()
    };
    
    chatHistory.unshift(newChat);
    saveChatHistory();
    renderChatHistory();
}

function generateChatId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getInitialMessage() {
    return `
        <div class="message assistant-message">
            <div class="message-avatar assistant-avatar">
                <span>🤖</span>
            </div>
            <div class="message-content">
                <div class="message-text">Hello! I'm your AI assistant. How can I help you today?</div>
                <div class="message-footer">
                    <span class="message-time">${formatTime(new Date())}</span>
                    <div class="message-actions">
                        <button class="action-btn copy-btn" onclick="copyMessage(this)">📋</button>
                        <button class="action-btn like-btn">👍</button>
                        <button class="action-btn dislike-btn">👎</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Message handling
function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || isLoading) return;
    
    // Create user message
    const userMessage = {
        id: generateMessageId(),
        content: content,
        role: 'user',
        timestamp: new Date()
    };
    
    // Add to UI
    addMessageToUI(userMessage);
    
    // Clear input
    messageInput.value = '';
    adjustTextareaHeight();
    
    // Show loading
    showLoading();
    
    // Simulate AI response
    setTimeout(() => {
        const aiResponse = {
            id: generateMessageId(),
            content: `I understand you're asking about: "${content}". This is a demo response. In a real implementation, this would connect to your FastAPI backend or AI service.`,
            role: 'assistant',
            timestamp: new Date()
        };
        
        hideLoading();
        addMessageToUI(aiResponse);
        
        // Save to current chat
        if (currentChatId) {
            const chat = chatHistory.find(c => c.id === currentChatId);
            if (chat) {
                chat.messages.push(userMessage, aiResponse);
                // Update title if it's the first message
                if (chat.title === 'New Chat') {
                    chat.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
                }
                saveChatHistory();
                renderChatHistory();
            }
        }
    }, 1000 + Math.random() * 2000);
}

function generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function addMessageToUI(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.role}-message`;
    
    const avatarClass = message.role === 'user' ? 'user-avatar' : 'assistant-avatar';
    const avatarIcon = message.role === 'user' ? '👤' : '🤖';
    
    messageElement.innerHTML = `
        <div class="message-avatar ${avatarClass}">
            <span>${avatarIcon}</span>
        </div>
        <div class="message-content">
            <div class="message-text">${message.content}</div>
            <div class="message-footer">
                <span class="message-time">${formatTime(message.timestamp)}</span>
                <div class="message-actions">
                    <button class="action-btn copy-btn" onclick="copyMessage(this)">📋</button>
                    ${message.role === 'assistant' ? `
                        <button class="action-btn like-btn">👍</button>
                        <button class="action-btn dislike-btn">👎</button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    messages.appendChild(messageElement);
    scrollToBottom();
}

function showLoading() {
    isLoading = true;
    loadingMessage.style.display = 'flex';
    sendBtn.disabled = true;
    scrollToBottom();
}

function hideLoading() {
    isLoading = false;
    loadingMessage.style.display = 'none';
    sendBtn.disabled = false;
}

function scrollToBottom() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Input handling
function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 128) + 'px';
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Utility functions
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function copyMessage(button) {
    const messageText = button.closest('.message-content').querySelector('.message-text').textContent;
    navigator.clipboard.writeText(messageText).then(() => {
        // Simple feedback
        button.textContent = '✓';
        setTimeout(() => {
            button.textContent = '📋';
        }, 1000);
    });
}

// Chat history management
function loadChatHistory() {
    const stored = localStorage.getItem('chatHistory');
    if (stored) {
        chatHistory = JSON.parse(stored);
        renderChatHistory();
    }
}

function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function renderChatHistory() {
    chatList.innerHTML = '';
    
    chatHistory.forEach(chat => {
        const chatElement = document.createElement('div');
        chatElement.className = 'chat-item';
        if (chat.id === currentChatId) {
            chatElement.classList.add('active');
        }
        
        const preview = chat.messages.length > 0 
            ? chat.messages[chat.messages.length - 1].content.substring(0, 50) + '...'
            : 'No messages yet';
            
        chatElement.innerHTML = `
            <div class="chat-item-title">${chat.title}</div>
            <div class="chat-item-preview">${preview}</div>
        `;
        
        chatElement.addEventListener('click', () => loadChat(chat.id));
        chatList.appendChild(chatElement);
    });
}

function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    messages.innerHTML = getInitialMessage();
    
    // Load messages
    chat.messages.forEach(message => {
        addMessageToUI(message);
    });
    
    renderChatHistory();
}

// Responsive handling
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
});

// Close sidebar on mobile when clicking outside
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target) &&
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});