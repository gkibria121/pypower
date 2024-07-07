import { chromium } from "playwright-extra" ;
import axios from "axios" ;
import { newInjectedContext } from "fingerprint-injector";
import { FingerprintGenerator } from "fingerprint-generator";

async function getTimezoneFromIP(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data.timezone;
  } catch (error) {
    console.error("Error fetching timezone:", error);
    return "America/New_York"; // Default timezone if fetch fails
  }
}

async function getProxyIP(proxy) {
  try { 
    const parts =  proxy.server.split(":")
    const response = await axios.get("http://api.ipify.org", {
      proxy: {
        host: parts[1].replace("//",""),
        port: parts[2],
        auth: {
          username: proxy.username,
          password: proxy.password,
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching proxy IP:", error);
    return null;
  }
}

export const getBrowser =  async({ proxy=undefined, executablePath = "", timezone="America/New_York",ipTimeZone = true  } = {}) => {
    let timezoneId = timezone;
    if( proxy && ipTimeZone  ){
        let proxyIP = await getProxyIP(proxy);
        // console.log(`Proxy IP: ${proxyIP}`);
      
        timezoneId = await getTimezoneFromIP(proxyIP);
        // console.log(`Using timezone: ${timezone}`);
    }
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-webgl",
      "--use-gl=desktop",
      "--disable-gpu-sandbox",
      "--ignore-gpu-blocklist",
      "--enable-webgl",
      "--enable-gpu-rasterization"
      
    ],
    proxy: proxy  ,
    executablePath:"Browsers\\nstchrome-124-202407011800\\nstchrome.exe"
    
  });

  let fingerprintGenerator = new FingerprintGenerator({
    browsers: [{ name: "chrome", minVersion: 87 }, "safari"],
    devices: ["desktop"],
    operatingSystems: ["windows", "macos", "linux", "android", "ios"],
    mockWebRTC: true
  });

  let { fingerprint, headers } = fingerprintGenerator.getFingerprint({
    operatingSystems: ["windows", "macos", "linux", "android", "ios"],
    locales: ["en-US", "en"],
  });

  const context = await newInjectedContext(browser, {
    fingerprintOptions: {
      ...fingerprint
    },
    newContextOptions: {
      timezoneId: timezoneId  ,
      locale:   "en-US",
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

  return context;
}
 

 