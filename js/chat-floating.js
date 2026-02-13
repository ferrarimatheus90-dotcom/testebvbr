
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatWidget = document.getElementById('bruno-chat-widget');
    const chatWindow = document.getElementById('bruno-chat-window');
    const toggleBtn = document.getElementById('bruno-chat-toggle');
    const closeBtn = document.getElementById('close-chat-btn');
    const chatBody = document.getElementById('chat-body');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    if (!chatWidget) return;

    // --- Toggle Logic ---
    function toggleChat() {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            userInput.focus();
        }
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // --- Chat Logic ---

    // Integration Service
    class IntegrationService {
        constructor() {
            // Consolidated workflow (Lead Scoring + Chat)
            this.n8nWebhook = "https://agente-n8n.qy9sqv.easypanel.host/webhook/lp-bruno-viana";
        }

        async sendToN8n(data) {
            console.log("Sending data to n8n:", data);

            try {
                const response = await fetch(this.n8nWebhook, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const jsonResponse = await response.json();

                    // Handle n8n array response
                    const data = Array.isArray(jsonResponse) ? jsonResponse[0] : jsonResponse;
                    return data; // Returns { output: "..." }
                } else {
                    console.error(`HTTP Error: ${response.status}`);
                    return null;
                }
            } catch (error) {
                console.error(`Connection Error:`, error);
                return null;
            }
        }
    }

    const integration = new IntegrationService();

    let isTyping = false;
    let userData = {};
    let step = 0;

    // --- Knowledge Base (Fallback & Instant Answers) ---
    const knowledgeBase = {
        default: "Posso te ajudar com dúvidas sobre <strong>Consultoria</strong>, <strong>Mentoria</strong>, <strong>Palestras</strong> ou <strong>Automação com IA</strong>. O que gostaria de saber?",
        keywords: [
            // Keep some local keywords for instant reaction if desired, 
            // OR remove them to let everything go to AI. 
            // Let's keep "contact" details locally for speed, but let AI handle the rest.
        ]
    };

    function addMessage(text, sender = 'system') {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerHTML = text; // Be careful with innerHTML in prod, but needed for bold tags here
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'system', 'typing-indicator');
        typingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        typingDiv.id = 'typing-indicator';
        chatBody.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) typingDiv.remove();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Event Listeners
    async function sendMessage() {
        const text = userInput.value.trim();
        if (text && !isTyping) {
            // 1. Show User Message
            addMessage(text, 'user');
            userInput.value = '';

            isTyping = true;
            addTypingIndicator(); // Show "..."

            // 2. Prepare Payload
            // If we have a name, send it. If it's the first interaction, user likely sent their name.
            let payload = {
                message: text,
                source: 'chat',
                sessionId: userData.name || 'anonymous_' + Date.now() // Simple session tracking
            };

            // STEP 0: Capture Name locally (optional, helps context)
            if (step === 0) {
                let name = text;
                // Simple text extraction for name
                const nameMatch = text.match(/(?:chamo|sou|nome é|eu sou)\s+(\w+)/i);
                if (nameMatch && nameMatch[1]) {
                    name = nameMatch[1];
                } else if (text.split(' ').length > 3) {
                    name = text.split(' ')[0];
                }
                name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                userData.name = name;
                payload.name = name;
                payload.message = `Meu nome é ${name}. ${text}`; // Contextualize for AI
                step = 1;
            }

            // 3. Send to AI
            const aiResponse = await integration.sendToN8n(payload);

            removeTypingIndicator();
            isTyping = false;

            // 4. Show AI Response
            if (aiResponse && aiResponse.output) {
                // n8n Agents usually return { output: "text" }
                addMessage(aiResponse.output, 'system');

            } else if (aiResponse && typeof aiResponse === 'string') {
                // Sometimes it returns raw string
                addMessage(aiResponse, 'system');

            } else if (aiResponse && aiResponse.text) {
                // Or { text: "..." }
                addMessage(aiResponse.text, 'system');

            } else {
                // Fallback if AI fails or format is weird
                console.warn("AI Response format unknown:", aiResponse);
                addMessage("Desculpe, tive um problema de conexão com a IA.", 'system');
            }
        }
    }

    // Initial Greeting
    setTimeout(() => {
        // Check if we haven't interacted yet
        if (step === 0 && chatBody.querySelectorAll('.message.user').length === 0) {
            const firstMsg = chatBody.querySelector('.message.system');
            if (firstMsg && firstMsg.innerHTML.includes("Olá")) {
                // Already set in HTML
            } else {
                // Force greeting if needed
            }
        }
    }, 500);

    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

});
