
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
            this.n8nWebhook = "https://agente-n8n.qy9sqv.easypanel.host/webhook/lp-bruno-viana";
        }

        async sendToN8n(data, maxRetries = 3) {
            console.log("Sending data to n8n:", data);
            let retries = 0;

            while (retries < maxRetries) {
                try {
                    const response = await fetch(this.n8nWebhook, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        return true;
                    } else {
                        console.error(`Attempt ${retries + 1} failed: HTTP ${response.status}`);
                    }
                } catch (error) {
                    console.error(`Attempt ${retries + 1} error:`, error);
                }

                retries++;
                if (retries < maxRetries) {
                    const delay = Math.pow(2, retries) * 1000;
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            throw new Error('Falha ao enviar dados.');
        }
    }

    const integration = new IntegrationService();

    let isTyping = false;
    let userData = {};
    let step = 0;

    // Updated Flow
    const flow = [
        {
            id: 'name',
            field: 'name'
            // Question asked initially in HTML: "Qual é o seu nome?"
        },
        {
            id: 'contact',
            question: "Prazer, {name}! Qual seu <strong>Email ou WhatsApp</strong> para retornarmos?",
            field: 'contact'
        },
        {
            id: 'company',
            question: "Entendido. Qual o nome da sua empresa?",
            field: 'company'
        },
        {
            id: 'interest',
            question: "O que você tem interesse hoje? (Ex: Consultoria, Automação, Treinamento)",
            field: 'interest'
        }
    ];

    function addMessage(text, sender = 'system') {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerHTML = text; // Allow HTML for bolding
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function handleNextStep(input) {
        if (step >= flow.length) return;

        // 1. Save Data from PREVIOUS step (or initial step)
        const currentStepObj = flow[step];
        userData[currentStepObj.field] = input;

        step++;

        // 2. Ask NEXT question
        if (step < flow.length) {
            let nextQ = flow[step].question;
            if (nextQ.includes('{name}')) nextQ = nextQ.replace('{name}', userData.name);

            // Simulate typing delay
            isTyping = true;
            setTimeout(() => {
                addMessage(nextQ, 'system');
                isTyping = false;
            }, 600);
        } else {
            // End of Flow
            isTyping = true;
            setTimeout(() => {
                addMessage("Perfeito! Estou processando suas informações...", 'system');
                finishProcess();
            }, 600);
        }
    }

    async function finishProcess() {
        try {
            await integration.sendToN8n(userData);
            setTimeout(() => {
                addMessage("✅ Recebido! Entraremos em contato em breve.", 'system');
                isTyping = false;
            }, 1000);
        } catch (error) {
            addMessage("❌ Erro de conexão. Tente novamente.", 'system');
            isTyping = false;
        }
    }

    // Event Listeners
    function sendMessage() {
        const text = userInput.value.trim();
        if (text && !isTyping) {
            addMessage(text, 'user');
            userInput.value = '';
            handleNextStep(text);
        }
    }

    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

});
