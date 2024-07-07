 
import { getBrowser } from "./browser.js";
async function automateTask() {


  const context = await getBrowser({ proxy : {
    server: "http://serv.dtt360.com:8000",
    username: "Skhan",
    password: "qGsg86afVQOnK-country-US-session-7Xx9B3Pb",
    executablePath : "Browsers\\nstchrome-124-202407011800\\nstchrome.exe",
    ipTimeZone : true
  } });
  const page2 = await context.newPage();
  const page = await context.newPage();
  page2.close()

  try {
    await page.goto("https://browserscan.net");
    console.log("Navigation to browserscan.net completed");

    // Wait for a random time between 5 and 10 seconds
    await page.waitForTimeout(5000 + Math.floor(Math.random() * 5000));
  } catch (error) {
    console.error("Error during navigation:", error);
  }

  await new Promise((resolve) => setTimeout(resolve, 600000));
  await context.browser().close();
}
automateTask();
