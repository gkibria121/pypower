// browser.js
import { chromium } from "playwright-extra";
import axios from "axios";
import { newInjectedContext } from "fingerprint-injector";
import { FingerprintGenerator } from "fingerprint-generator";

class BrowserManager {
  constructor(options = {}) {
    this.proxy = options.proxy;
    this.executablePath = options.executablePath || "Browsers\\nstchrome-124-202407011800\\nstchrome.exe";
    this.timezone = options.timezone || "America/New_York";
    this.ipTimeZone = options.ipTimeZone || true;
    this.context = null;
    this.timezoneId = this.timezone;
  }

  async getTimezoneFromIP(ip) {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      return response.data.timezone;
    } catch (error) {
      console.error("Error fetching timezone:", error);
      return "America/New_York"; // Default timezone if fetch fails
    }
  }

  async getProxyIP() {
    if (!this.proxy) return null;
    try {
      const parts = this.proxy.server.split(":");
      const response = await axios.get("http://api.ipify.org", {
        proxy: {
          host: parts[1].replace("//", ""),
          port: parts[2],
          auth: {
            username: this.proxy.username,
            password: this.proxy.password,
          },
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching proxy IP:", error);
      return null;
    }
  }

  async updateTimezone() {
    if (this.proxy && this.ipTimeZone) {
      try {
        let proxyIP = await this.getProxyIP();
        let newTimezoneId = await this.getTimezoneFromIP(proxyIP);
        if (newTimezoneId !== this.timezoneId) {
          this.timezoneId = newTimezoneId;
          await this.context.setTimezone(this.timezoneId);
          console.log(`Updated timezone to: ${this.timezoneId}`);

          // Reload all pages after updating the timezone
          const pages = this.context.pages();
          for (const page of pages) {
            await page.reload();
          }
        }
      } catch (error) {
        console.error("Error updating timezone:", error);
      }
    }
  }

  async getBrowser() {
    if (this.proxy && this.ipTimeZone) {
      let proxyIP = await this.getProxyIP();
      this.timezoneId = await this.getTimezoneFromIP(proxyIP);
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
      proxy: this.proxy,
      executablePath: this.executablePath
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

    this.context = await newInjectedContext(browser, {
      fingerprintOptions: {
        ...fingerprint
      },
      newContextOptions: {
        timezoneId: this.timezoneId,
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

    // Schedule the timezone update after 10 seconds
    setTimeout(() => this.updateTimezone(), 10000);

    return this.context;
  }
}

export const getBrowser = async (options = {}) => {
  const browserManager = new BrowserManager(options);
  return browserManager.getBrowser();
};