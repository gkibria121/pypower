
import { getBrowser } from "./browser.js";
import {   clickOnAd, clickOnAdLink, clickOnSite, getAdLink, unlockAd } from "./page.js";
async function automateTask() {


  const context = await getBrowser({ proxy : {
    server: "http://serv.dtt360.com:8000", 
    username: "Skhan",
    password: "qGsg86afVQOnK-country-US-session-4pJtcaQz",
    executablePath : "Browsers\\nstchrome-124-202407011800\\nstchrome.exe",
    ipTimeZone : true
  } });
  const page2 = await context.newPage();
  const page0 = await context.newPage();
  page2.close()

  try {
    
    await page0.goto("https://browserscan.net");
    console.log("Navigation to browserscan.net completed");
    const page = await context.newPage();
     
    await unlockAd(page,"https://tinyshorten.com/Tasin-SS","1111")
    const adLinkPage =  await getAdLink(page, 1)
    const adPage =  await clickOnAdLink(adLinkPage)
    
    const adSite = await clickOnAd(adPage);

    await clickOnSite(adSite)

    
  } catch (error) {
    console.error("Error during navigation:", error);
  }
  await context.browser().close();
}
automateTask();
