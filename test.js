const { chromium } = require('playwright');
const { newInjectedContext }  = require('fingerprint-injector');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await newInjectedContext(
        browser,
        {
            // Constraints for the generated fingerprint (optional)
            fingerprintOptions: {
                devices: ['mobile'],
                operatingSystems: ['ios'],
            },
            // Playwright's newContext() options (optional, random example for illustration)
            newContextOptions: {
                geolocation: {
                    latitude: 51.50853,
                    longitude: -0.12574,
                }
            }
        },
    );

    const page = await context.newPage();
    await page.goto("https://www.nowsecure.nl")
   // ... your code using `page` here
})();