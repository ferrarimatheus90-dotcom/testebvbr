// Integration Service (Inlined for local compatibility)
class IntegrationService {
    constructor() {
        this.n8nWebhook = "https://agente-n8n.qy9sqv.easypanel.host/webhook/lp-bruno-viana";
        this.supabaseUrl = "YOUR_SUPABASE_URL";
        this.supabaseKey = "YOUR_SUPABASE_KEY";
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
                const delay = Math.pow(2, retries) * 1000; // Exponential backoff: 2s, 4s, 8s
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw new Error('Falha ao enviar dados após múltiplas tentativas.');
    }

    async saveLead(leadData) {
        console.log("Saving lead to Supabase:", leadData);
    }
}

const integration = new IntegrationService();

// DOM Elements
const chatBody = document.getElementById('chat-interface');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// State
const flow = [
    {
        id: 'name',
        question: "Para começar, qual é o seu nome?",
        field: 'name'
    },
    {
        id: 'email',
        question: "Prazer, {name}. Qual o seu melhor email para contato?",
        field: 'email'
    },
    {
        id: 'company',
        question: "Qual o nome da sua empresa?",
        field: 'company'
    },
    {
        id: 'revenue',
        question: "Qual o faturamento mensal aproximado da sua operação hoje?",
        field: 'revenue'
    },
    {
        id: 'challenge',
        question: "Por último: qual é o seu maior desafio de vendas ou marketing atualmente?",
        field: 'challenge'
    }
];

// Helper Functions
function addMessage(text, sender = 'system') {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);

    // Insert BEFORE the input area, not append at end
    const inputArea = document.querySelector('.input-area');
    chatBody.insertBefore(msgDiv, inputArea);

    if (sender === 'system') {
        typeText(msgDiv, `> ${text}`);
    } else {
        msgDiv.textContent = `> ${text}`;
        scrollToBottom();
    }
}

function typeText(element, text, speed = 30) {
    isTyping = true;
    let i = 0;

    // Element is already inserted in addMessage
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            scrollToBottom();
            setTimeout(type, speed);
        } else {
            isTyping = false;
            // Add blinking cursor effect at end if needed
        }
    }
    type();
}

function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
}

function extractName(text) {
    // 1. Remove common prefixes (case insensitive)
    const prefixes = [
        "meu nome é", "me chamo", "eu sou", "sou o", "sou a",
        "aqui é o", "aqui é a", "o meu nome é", "eu me chamo",
        "oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "prazer",
        "tudo bem", "ei", "opa"
    ];

    let cleanText = text.toLowerCase();

    // Sort by length desc to remove longer phrases first ("o meu nome é" before "é")
    prefixes.sort((a, b) => b.length - a.length);

    prefixes.forEach(prefix => {
        // Remove prefix if it appears at the start or end, or as a distinct word
        cleanText = cleanText.replace(new RegExp(`\\b${prefix}\\b`, 'gi'), '').trim();
    });

    // 2. Remove special characters and extra spaces
    cleanText = cleanText.replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();

    // 3. Capitalize first letters
    return cleanText.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

async function handleNextStep(input) {
    if (step >= flow.length) return;

    // Save Data
    const currentStepObj = flow[step];
    let valueToSave = input;

    // NLP for Name Extraction
    if (currentStepObj.field === 'name') {
        valueToSave = extractName(input);
    }

    userData[currentStepObj.field] = valueToSave;

    step++;

    // Check if finished
    if (step < flow.length) {
        let nextQ = flow[step].question;
        // Replace placeholders
        if (nextQ.includes('{name}')) nextQ = nextQ.replace('{name}', userData.name);

        // Slight delay for realism
        setTimeout(() => {
            addMessage(nextQ, 'system');
        }, 800);
    } else {
        // Final Step
        setTimeout(() => {
            addMessage("Processando dados...", 'system');
            finishProcess();
        }, 800);
    }
}

async function finishProcess() {
    // Send to n8n
    try {
        await integration.sendToN8n(userData);
        setTimeout(() => {
            addMessage("DADOS RECEBIDOS. Análise concluída.", 'system');
            setTimeout(() => {
                addMessage("Um consultor sênior entrará em contato em breve.", 'system');
            }, 1000);
        }, 2000);
    } catch (error) {
        addMessage("Erro de conexão. Tente novamente.", 'system');
    }
}

// Event Listeners
sendBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (text && !isTyping) {
        addMessage(text, 'user');
        userInput.value = '';
        handleNextStep(text);
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

// Animations (Scroll Reveal)
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.pillar-card, .step-card, .about-content').forEach(el => {
    el.classList.add('fade-in-section'); // Add CSS class for init state
    observer.observe(el);
});

// Tilt Effect for Pillar Cards
const cards = document.querySelectorAll('.pillar-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const content = card.querySelector('.icon-wrapper'); // Or entire card context

        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});
