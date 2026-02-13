
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    // Launch browser in non-headless mode for user observation
    const browser = await puppeteer.launch({
        headless: false, // User wants to watch
        slowMo: 100,     // Slow down operations by 100ms
        defaultViewport: null, // Use full window size
        args: ['--start-maximized'] // Start maximized
    });

    const page = await browser.newPage();

    console.log('Navigating to https://brunovianabr.com.br/...');
    try {
        await page.goto('https://brunovianabr.com.br/', { waitUntil: 'networkidle2' });
    } catch (error) {
        console.error('Failed to load page.');
        console.error(error);
        await browser.close();
        process.exit(1);
    }

    // 1. Verify Hero Section visibility
    console.log('Checking Hero Section...');
    await page.waitForSelector('.hero');
    const heroVisible = await page.$eval('.hero', el => !!el && el.offsetParent !== null);
    if (!heroVisible) throw new Error('Hero section not visible');
    console.log('PASS: Hero section is visible.');

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
    const methodologyId = await page.$eval('#metodologia', el => el.id).catch(() => null);
    if (methodologyId !== 'metodologia') {
        console.error('FAIL: Methodology ID not found or incorrect.');
    } else {
        console.log('PASS: Methodology ID is correct.');
    }

    // 4. Test Chat Interaction
    console.log('Testing Chat Interaction...');

    // Click toggle button
    await page.waitForSelector('#bruno-chat-toggle', { visible: true });
    await page.click('#bruno-chat-toggle');
    console.log('Clicked chat toggle.');
    await new Promise(r => setTimeout(r, 1000)); // Wait for animation

    // Verify chat window is open
    const chatWindowOpen = await page.$eval('#bruno-chat-window', el => el.classList.contains('open'));
    if (!chatWindowOpen) throw new Error('Chat window failed to open');
    console.log('PASS: Chat window opened.');

    // Type message
    console.log('Typing message...');
    await page.waitForSelector('#userInput', { visible: true });
    await page.type('#userInput', 'Test Message Puppeteer Live');
    await page.click('#sendBtn');
    console.log('Message sent.');

    // Wait for AI response 
    console.log('Waiting for AI response (up to 10s)...');
    try {
        // Wait for a new system message that comes after our user message
        // This is a bit tricky, simpler is just to wait for count increase or specific text
        await page.waitForFunction(
            () => document.querySelectorAll('.message.system').length >= 2,
            { timeout: 10000 }
        );
        console.log('PASS: AI Response received.');
    } catch (e) {
        console.warn('WARNING: Timed out waiting for AI response. It might be slow or failed.');
    }

    // Capture the final state
    const screenshotPath = path.join(__dirname, 'verify_live_site.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to ${screenshotPath}`);

    console.log('Keeping browser open for 10 seconds for user observation...');
    await new Promise(r => setTimeout(r, 10000));

    await browser.close();
    console.log('Verification Complete.');

})();
