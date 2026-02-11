const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    console.log('🚀 Iniciando teste automatizado do Chatbot...');
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false, // Visualizar o navegador
            slowMo: 50, // Lenta para vermos a ação
            defaultViewport: null,
            args: ['--start-maximized']
        });
    } catch (error) {
        console.error('❌ ERRO CRÍTICO AO INICIAR PUPPETEER:', error);
        process.exit(1);
    }

    const page = await browser.newPage();

    // Interceptar requests para verificar o envio ao n8n
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.url().includes('webhook/lp-bruno-viana')) {
            console.log('✅ Webhook disparado:', request.url());
            console.log('📦 Dados enviados:', request.postData());
        }
        request.continue();
    });

    page.on('response', response => {
        if (response.url().includes('webhook/lp-bruno-viana')) {
            console.log('📥 Resposta do n8n:', response.status());
            if (response.status() === 200 || response.status() === 201) {
                console.log('✅ SUCESSO! Dados recebidos pelo n8n.');
            } else {
                console.error('❌ ERRO! n8n retornou erro.');
            }
        }
    });

    // Função auxiliar para enviar mensagem
    async function sendMessage(text) {
        try {
            await page.waitForSelector('#userInput', { visible: true, timeout: 5000 });
            await page.type('#userInput', text);
            await page.click('#sendBtn');
            console.log(`👤 Usuário enviou: "${text}"`);
            // Aguarda um pouco para a resposta do bot
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.error(`❌ Falha ao enviar mensagem "${text}":`, e.message);
            throw e;
        }
    }

    // Caminho absoluto para o arquivo local
    const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
    console.log(`📂 Abrindo arquivo: ${filePath}`);

    const personas = [
        {
            name: "Alice Consultant",
            email: "alice@example.com",
            company: "Alice Tech",
            revenue: "R$ 50.000,00",
            challenge: "Organização de processos"
        },
        {
            name: "Bob Enterprise",
            email: "bob@corporation.com",
            company: "Bob Industries",
            revenue: "R$ 5.000.000,00",
            challenge: "Expansão internacional"
        }
    ];

    for (const [index, p] of personas.entries()) {
        console.log(`\n🔄 Executando teste ${index + 1}/${personas.length} para: ${p.name}`);

        await page.goto(filePath);
        // Esperar o chat carregar e focar na área code
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        try {
            console.log('💬 Iniciando conversa...');

            // Wait for chat to be ready
            await page.waitForSelector('.terminal-body', { visible: true, timeout: 10000 });

            // 1. Nome
            await new Promise(r => setTimeout(r, 3000));
            await sendMessage(p.name);

            // 2. Email
            await sendMessage(p.email);

            // 3. Empresa
            await sendMessage(p.company);

            // 4. Faturamento
            await sendMessage(p.revenue);

            // 5. Desafio
            await sendMessage(p.challenge);

            console.log(`✅ Fluxo concluído para ${p.name}. Aguardando envio...`);
            await new Promise(r => setTimeout(r, 5000));

        } catch (error) {
            console.error(`❌ Erro no fluxo de ${p.name}:`, error);
        }
    }

    console.log('\n🏁 Todos os testes finalizados.');
    console.log('Fechando navegador em 5 segundos...');
    await new Promise(r => setTimeout(r, 5000));

    await browser.close();
})();
