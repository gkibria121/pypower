import { getBrowser } from "./browser.js";
import { clickOnAd, clickOnAdLink, clickOnSite, getAdLink, unlockAd } from "./page.js";
import { parseProxyString } from "./proxy.js";
import { openDB, initDB, logExecution } from "./db.js";

export const   automateTask=  async (proxy={},type="",task=1,url= "https://tinyshorten.com/Tasin-SS") =>{
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
    try{

      await page0.goto("https://browserscan.net");
    }
    catch(error){

    }
 
    console.log("Navigation to browserscan.net completed");

    const page = await context.newPage();
  
    await unlockAd(page,url, "1111");
    const adLinkPage = await getAdLink(page, task);
    const adPage = await clickOnAdLink(adLinkPage,type=type);
    const adSite = await clickOnAd(adPage,type=type );
    if(type==='click'){
        await clickOnSite(adSite);
    }

    await logExecution(db,type, 'success', 'Task completed successfully', JSON.stringify(proxy));
  } catch (error) {
    console.error("Error during navigation:", error);
    await logExecution(db,type, 'error', error.message, JSON.stringify(proxy));
  }
  
  // console.log('Keeping the browser open for 600 seconds...');
  // await new Promise(resolve => setTimeout(resolve, 600000));
  await context.browser().close();
  await db.close();
}

