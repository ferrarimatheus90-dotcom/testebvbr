const https = require('https');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

(async () => {
    try {
        console.log('Checking HTML...');
        const html = await get('https://brunovianabr.com.br/');

        // Match src="js/chat-floating.js?v=..."
        const scriptMatch = html.match(/src=["']js\/chat-floating\.js\?v=([^"']+)["']/);
        console.log('>> Script Tag Version:', scriptMatch ? scriptMatch[1] : 'NOT FOUND IN HTML');

        console.log('\nChecking JS Content...');
        const js = await get('https://brunovianabr.com.br/js/chat-floating.js');

        const hasIntegration = js.includes('IntegrationService');
        const hasRedirect = js.includes('wa.me');

        console.log('>> JS contains "IntegrationService"?', hasIntegration ? 'YES (New Code)' : 'NO (Old Code)');
        console.log('>> JS contains "wa.me"?', hasRedirect ? 'YES (Should be gone)' : 'NO (Clean)');

        if (hasIntegration) {
            console.log('\nCONCLUSION: The server has the NEW code. The issue is likely browser caching.');
        } else {
            console.log('\nCONCLUSION: The server still has the OLD code. Deployment failed or cached at edge.');
        }

    } catch (e) {
        console.error('Error:', e);
    }
})();
