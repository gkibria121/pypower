import { getBrowser } from "./browser.js";
import { clickOnAd, clickOnAdLink, clickOnSite, getAdLink, unlockAd } from "./page.js";
import { parseProxyString } from "./proxy.js";
import { openDB, initDB, logExecution } from "./db.js";

const  automateTask=  async (proxy={},type="") =>{
  const db = await openDB();
  await initDB(db);

  const context = await getBrowser({
    proxy: proxy,
    executablePath: "Browsers\\nstchrome-124-202407011800\\nstchrome.exe",
    ipTimeZone: true
  });

  const page2 = await context.newPage();
  const page0 = await context.newPage();
  page2.close();

  try {
    await page0.goto("https://browserscan.net");
    console.log("Navigation to browserscan.net completed");

    const page = await context.newPage();
    await unlockAd(page, "https://tinyshorten.com/Robel-SS", "1111");
    const adLinkPage = await getAdLink(page, 1);
    const adPage = await clickOnAdLink(adLinkPage);
    const adSite = await clickOnAd(adPage);
    if(type==='click'){
        await clickOnSite(adSite);
    }

    await logExecution(db,type, 'success', 'Task completed successfully');
  } catch (error) {
    console.error("Error during navigation:", error);
    await logExecution(db,type, 'error', error.message,JSON.stringify(proxy));
  }

  await context.browser().close();
  await db.close();
}

const proxy = parseProxyString("serv.dtt360.com:8000:Skhan:qGsg86afVQOnK-country-US-session-Lbvc25Vh");

automateTask(proxy,'expression');
