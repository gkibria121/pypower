const { chromium } = require("playwright-extra");
const axios = require("axios");
const { newInjectedContext } = require("fingerprint-injector");
const { FingerprintGenerator } = require("fingerprint-generator");
async function getTimezoneFromIP(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data.timezone;
  } catch (error) {
    console.error("Error fetching timezone:", error);
    return "America/New_York"; // Default timezone if fetch fails
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
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
    proxy: {
      server: "http://serv.dtt360.com:8000",
      username: "Skhan",
      password: "qGsg86afVQOnK-country-US-session-7Xx9B3Pb",
    },
    executablePath : "Browsers\\nstchrome-124-202407011800\\nstchrome.exe"
  });
  
  let fingerprintGenerator = new FingerprintGenerator({
    browsers: [  { name: "chrome", minVersion: 87 }, "safari"],
    devices: ["desktop"],
    operatingSystems: ["windows","macos","linux","android","ios"],
    mockWebRTC : true
  });
  let { fingerprint, headers } = fingerprintGenerator.getFingerprint({
    operatingSystems: ["windows","macos","linux","android","ios"],
    locales: ["en-US", "en"],
  });
  // console.log(fingerprint);
  const context = await newInjectedContext(browser, {
    // Constraints for the generated fingerprint (optional)
    fingerprintOptions: {
      ...fingerprint
      
    },
    // Playwright's newContext() options (optional, random example for illustration)
    newContextOptions: {
      timezoneId: timezone,
      locale: "en-US",
      ...headers,
      viewport: { width: 1360, height: 720 },
      deviceScaleFactor: 1,
      hasTouch: false,
      geolocation: {
        latitude: 51.50853,
        longitude: -0.12574,
      },
    },
    
    
  });

  const page = await context.newPage();

  try {
    await page.goto("https://browserscan.net");
    console.log("Navigation to browserscan.net completed");

    // Wait for a random time between 5 and 10 seconds
    await page.waitForTimeout(5000 + Math.floor(Math.random() * 5000));
  } catch (error) {
    console.error("Error during navigation:", error);
  }

  await new Promise((resolve) => setTimeout(resolve, 600000));
  await browser.close();
}

async function getProxyIP() {
  try {
    const response = await axios.get("http://api.ipify.org", {
      proxy: {
        host: "serv.dtt360.com",
        port: 8000,
        auth: {
          username: "Skhan",
          password: "qGsg86afVQOnK-country-US-session-7Xx9B3Pb",
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching proxy IP:", error);
    return null;
  }
}

automateTask();
