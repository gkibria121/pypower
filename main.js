// main.js
import { getBrowser } from "./browser.js";
import AdNavigator from "./page.js"; 
import { openDB, initDB, logExecution } from "./db.js";

class TaskAutomator {
  constructor() {
    this.adNavigator = new AdNavigator();
    this.db = null;
  }

  async init() {
    this.db = await openDB();
    await initDB(this.db);
  }

  async automateTask(proxy = {}, type = "", task = 1, url = "https://tinyshorten.com/Tasin-SS") {
    await this.init();

    const context = await getBrowser({
      proxy: proxy,
      executablePath: "Browsers\\nstchrome-124-202407011800\\nstchrome.exe",
      ipTimeZone: true
    });

    const page2 = await context.newPage();
    const page0 = await context.newPage();
    await page2.close();

    try {
      try {
        await page0.goto("https://browserscan.net");
      } catch (error) {
        console.error("Error navigating to browserscan.net:", error);
      }
 
      console.log("Navigation to browserscan.net completed");

      const page = await context.newPage();
  
      await this.adNavigator.unlockAd(page, url, "1111");
      const adLinkPage = await this.adNavigator.getAdLink(page, task);
      const adPage = await this.adNavigator.clickOnAdLink(adLinkPage, type);
      const adSite = await this.adNavigator.clickOnAd(adPage, type);
      
      if (type === 'click') {
        await this.adNavigator.clickOnSite(adSite);
      }

      await logExecution(this.db, type, 'success', 'Task completed successfully', JSON.stringify(proxy));
    } catch (error) {
      console.error("Error during navigation:", error);
      await logExecution(this.db, type, 'error', error.message, JSON.stringify(proxy));
    } finally {
      // Uncomment the following lines if you want to keep the browser open for debugging
      console.log('Keeping the browser open for 600 seconds...');
      await new Promise(resolve => setTimeout(resolve, 600000));
      
      await context.browser().close();
      await this.db.close();
    }
  }
}

export const automateTask = async (proxy = {}, type = "", task = 1, url = "https://tinyshorten.com/Tasin-SS") => {
  const automator = new TaskAutomator();
  await automator.automateTask(proxy, type, task, url);
};