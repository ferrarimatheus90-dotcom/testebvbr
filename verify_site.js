
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport for a standard desktop view
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to localhost:8000...');
    try {
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
    } catch (error) {
        console.error('Failed to load page. Is the server running?');
        console.error(error);
        await browser.close();
        process.exit(1);
    }

    // 1. Verify Hero Section visibility
    console.log('Checking Hero Section...');
    const heroVisible = await page.$eval('.hero', el => !!el && el.offsetParent !== null);
    if (!heroVisible) throw new Error('Hero section not visible');

    // 2. Scroll to trigger animations
    console.log('Scrolling down to trigger animations...');
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });

    // Wait for animations to settle
    await new Promise(r => setTimeout(r, 1000));

    // 3. Verify Methodology Section has ID
    console.log('Checking "Metodologia" ID...');
    const methodologyId = await page.$eval('.methodology', el => el.id);
    if (methodologyId !== 'metodologia') {
        console.error('FAIL: Methodology ID is incorrectly set to: ' + methodologyId);
    } else {
        console.log('PASS: Methodology ID is correct.');
    }

    // 4. Test Chat Interaction
    console.log('Testing Chat Interaction...');

    // Click toggle button
    await page.click('#bruno-chat-toggle');
    await new Promise(r => setTimeout(r, 500)); // Wait for animation

    // Verify chat window is open
    const chatWindowOpen = await page.$eval('#bruno-chat-window', el => el.classList.contains('open'));
    if (!chatWindowOpen) throw new Error('Chat window failed to open');
    console.log('PASS: Chat window opened.');

    // Type message
    await page.type('#userInput', 'Test Message Puppeteer');
    await page.click('#sendBtn');

    // Wait for AI response (mock wait)
    console.log('Waiting for AI response...');
    await new Promise(r => setTimeout(r, 3000)); // Wait 3s

    // Check if messages appeared
    const messages = await page.$$eval('.message', els => els.length);
    console.log(`PASS: Found ${messages} messages in chat.`);

    // Take screenshot of the result
    const screenshotPath = path.join(__dirname, 'verify_puppeteer.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to ${screenshotPath}`);

    await browser.close();
    console.log('Verification Complete.');

})();
