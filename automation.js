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
  // Get the proxy IP first
  const proxyIP = await getProxyIP();
  console.log(`Proxy IP: ${proxyIP}`);

  // Get timezone from proxy IP
  const timezone = await getTimezoneFromIP(proxyIP);
  console.log(`Using timezone: ${timezone}`);

  const browser = await chromium.launch({
    headless: false,
    proxy: {
      server: 'http://serv.dtt360.com:8000',
      username: 'Skhan',
      password: 'qGsg86afVQOnK-country-US-session-7Xx9B3Pb'
    }
  });
  
  // Create context with the detected timezone
  const context = await browser.newContext({
    timezoneId: timezone,
    locale: 'en-US'
  });

  const page = await context.newPage();
  await page.goto('https://browserscan.net');

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