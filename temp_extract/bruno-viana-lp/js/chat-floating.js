
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

    // --- Knowledge Base ---
    const knowledgeBase = {
        default: "Posso te ajudar com dúvidas sobre <strong>Consultoria</strong>, <strong>Mentoria</strong>, <strong>Palestras</strong> ou <strong>Automação com IA</strong>. O que gostaria de saber?",
        keywords: [
            {
                terms: ['consultoria', 'consultor', 'diagnostico', 'auditoria'],
                answer: "A <strong>Consultoria Estratégica</strong> é ideal para empresas que precisam reestruturar seu processo de vendas. Analisamos seu funil, identificamos gargalos e implementamos soluções para aumentar a conversão. <br><br>Gostaria de agendar um diagnóstico?"
            },
            {
                terms: ['mentoria', 'mentor', 'acompanhamento'],
                answer: "A <strong>Mentoria</strong> é focada em líderes e gestores. O Bruno acompanha você quinzenalmente para definir estratégias de crescimento e liderança comercial."
            },
            {
                terms: ['palestra', 'speaker', 'evento'],
                answer: "O Bruno Viana realiza palestras sobre <strong>Vendas, IA e Futuro do Marketing</strong>. Já esteve nos maiores palcos do Brasil. <br><br>Para contratar, preencha o formulário abaixo."
            },
            {
                terms: ['preço', 'valor', 'custa', 'investimento', 'orcamento'],
                answer: "Como cada projeto é único, o investimento varia conforme o escopo (Consultoria, Mentoria ou Treinamento). <br><br>Recomendamos agendar uma conversa rápida para entendermos sua necessidade."
            },
            {
                terms: ['ia', 'inteligencia', 'artificial', 'automacao', 'bot'],
                answer: "Utilizamos <strong>Inteligência Artificial</strong> para automatizar prospecção, qualificar leads e personalizar o atendimento em escala. É o futuro das vendas hoje."
            },
            {
                terms: ['contato', 'falar', 'telefone', 'whatsapp', 'email'],
                answer: "Você pode falar conosco preenchendo o formulário nesta página ou clicando no botão de WhatsApp (se disponível). Nossa equipe responderá em breve!"
            },
            {
                terms: ['quem', 'bruno', 'historia'],
                answer: "Bruno Viana tem 25 anos de experiência, unindo a bagagem clássica de vendas com o que há de mais moderno em IA. Já gerou mais de R$ 10M em vendas otimizadas."
            }
        ]
    };



    function addMessage(text, sender = 'system') {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerHTML = text;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function getResponse(input) {
        const lowerInput = input.toLowerCase();

        // Check for matches
        for (const item of knowledgeBase.keywords) {
            if (item.terms.some(term => lowerInput.includes(term))) {
                return item.answer;
            }
        }

        // Default response if no match
        return "Desculpe, ainda estou aprendendo. Mas você pode falar sobre <strong>Consultoria</strong>, <strong>IA</strong> ou <strong>Preços</strong>.";
    }

    // Event Listeners
    function sendMessage() {
        const text = userInput.value.trim();
        if (text && !isTyping) {
            addMessage(text, 'user');
            userInput.value = '';

            isTyping = true;

            // Analyze and Respond
            const response = getResponse(text);

            setTimeout(() => {
                addMessage(response, 'system');
                isTyping = false;
            }, 800);
        }
    }

    // Initial Greeting
    setTimeout(() => {
        if (chatBody.children.length <= 1) {
            // HTML has static welcome
        }
    }, 1000);

    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

});
