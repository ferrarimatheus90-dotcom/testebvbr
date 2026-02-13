
const puppeteer = require('puppeteer');

const URL = 'https://brunovianabr.com.br/';

const testCases = [
    {
        name: 'Teste 1: Consultoria',
        data: {
            name: 'Joao Silva (Teste)',
            email: 'joao.teste@exemplo.com',
            whatsapp: '11999991111',
            company: 'JS Otimizacoes',
            challenges: 'Estamos com dificuldade em qualificar os leads que chegam do Facebook.',
            interest: 'consultoria'
        }
    },
    {
        name: 'Teste 2: Mentoria',
        data: {
            name: 'Maria Souza (Teste)',
            email: 'maria.teste@exemplo.com',
            whatsapp: '21988882222',
            company: 'Tech Solutions',
            challenges: 'Preciso estruturar meu time comercial do zero.',
            interest: 'treinamento'
        }
    },
    {
        name: 'Teste 3: IA',
        data: {
            name: 'Carlos Pereira (Teste)',
            email: 'carlos.teste@exemplo.com',
            whatsapp: '31977773333',
            company: 'Agencia CP',
            challenges: 'Quero automatizar o atendimento inicial com IA.',
            interest: 'automacao'
        }
    }
];

const fs = require('fs');

(async () => {
    let logBuffer = `Starting tests on ${URL} at ${new Date().toISOString()}\n`;
    const log = (msg) => {
        console.log(msg);
        logBuffer += msg + '\n';
    };

    log(`Starting tests on ${URL}...`);
    // 'headless: false' opens a visible browser window
    // 'slowMo: 100' adds a 100ms delay between actions so the user can see what's happening
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null, // Allows the browser to be full width
        args: ['--start-maximized'], // Start maximized
        slowMo: 100
    });
    const page = await browser.newPage();

    for (const test of testCases) {
        log(`\nRunning: ${test.name}`);
        try {
            await page.goto(URL, { waitUntil: 'networkidle2' });

            // Wait for form to be visible
            await page.waitForSelector('#interest-form');

            // Fill fields
            await page.type('#name', test.data.name);
            await page.type('#email', test.data.email);
            await page.type('#whatsapp', test.data.whatsapp);
            await page.type('#company', test.data.company);
            await page.type('#challenges', test.data.challenges);

            // Select interest
            await page.select('#interest', test.data.interest);

            // Submit
            log('Submitting form...');
            const submitBtn = await page.$('#form-submit-btn');
            await submitBtn.click();

            // Wait for success message
            // The logic in form.js adds class 'success' to #form-message and text content
            try {
                await page.waitForFunction(
                    () => document.querySelector('#form-message').classList.contains('success'),
                    { timeout: 10000 }
                );
                const msg = await page.$eval('#form-message', el => el.textContent);
                log(`✅ Success! Message: "${msg}"`);
            } catch (e) {
                log(`❌ Error waiting for success message: ${e.message}`);
                try {
                    const msg = await page.$eval('#form-message', el => el.textContent);
                    log(`Message content found: "${msg}"`);
                } catch (ex) { }
            }

        } catch (error) {
            log(`❌ Failed test ${test.name}: ${error}`);
        }
    }

    await browser.close();
    log('\nAll tests completed.');
    fs.writeFileSync('test_results.log', logBuffer);
})();
