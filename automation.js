const { chromium } = require('playwright');
const axios = require('axios');

async function getTimezoneFromIP(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data.timezone;
  } catch (error) {
    console.error('Error fetching timezone:', error);
    return 'America/New_York'; // Default timezone if fetch fails
  }
}

async function automateTask() {
  const proxyIP = await getProxyIP();
  console.log(`Proxy IP: ${proxyIP}`);

  const timezone = await getTimezoneFromIP(proxyIP);
  console.log(`Using timezone: ${timezone}`);

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-webrtc-encryption',
      '--disable-webrtc-hw-encoding',
      '--disable-webrtc-hw-decoding',
      '--disable-webrtc-multiple-routes',
      '--disable-webrtc-hw-vp8-encoding',
      '--disable-webrtc-hw-h264-encoding',
      '--force-webrtc-ip-handling-policy=disable_non_proxied_udp'
    ],
    proxy: {
      server: 'http://serv.dtt360.com:8000',
      username: 'Skhan',
      password: 'qGsg86afVQOnK-country-US-session-7Xx9B3Pb'
    }
  });
  
  const context = await browser.newContext({
    timezoneId: timezone,
    locale: 'en-US',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    hasTouch: false
  });

  await context.addInitScript(() => {
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );

    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });

    const originalRTCPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function(...args) {
      const pc = new originalRTCPeerConnection(...args);
      pc.createDataChannel = () => {};
      return pc;
    };
  });

  const page = await context.newPage();
  page.setDefaultNavigationTimeout(0);

  // Emulate human-like behavior
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  });

  try {
    await page.goto('https://browserscan.net');
    console.log('Navigation to browserscan.net completed');

    // Perform some random mouse movements and scrolls
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200, { steps: 10 });
    await page.mouse.up();
    await page.evaluate(() => {
      window.scrollTo({
        top: Math.floor(Math.random() * 100),
        behavior: 'smooth'
      });
    });

    // Wait for a random time between 5 and 10 seconds
    await page.waitForTimeout(5000 + Math.floor(Math.random() * 5000));

  } catch (error) {
    console.error('Error during navigation:', error);
  }

  await new Promise(resolve => setTimeout(resolve, 60000));
  await browser.close();
}

async function getProxyIP() {
  try {
    const response = await axios.get('http://api.ipify.org', {
      proxy: {
        host: 'serv.dtt360.com',
        port: 8000,
        auth: {
          username: 'Skhan',
          password: 'qGsg86afVQOnK-country-US-session-7Xx9B3Pb'
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching proxy IP:', error);
    return null;
  }
}

automateTask();