
import { getBrowser } from "./browser.js";
import {   clickOnAdLink, getAdLink, unlockAd } from "./page.js";
async function automateTask() {


  const context = await getBrowser({ proxy : {
    server: "http://serv.dtt360.com:8000",
    username: "Skhan",
    password: "qGsg86afVQOnK-country-US-session-7Xx9B3Pb",
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
   const adpage =  await getAdLink(page, 1)
    await clickOnAdLink(adpage)
  } catch (error) {
    console.error("Error during navigation:", error);
  }

  await new Promise((resolve) => setTimeout(resolve, 600000));
  await context.browser().close();
}
automateTask();
