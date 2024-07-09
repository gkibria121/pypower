import { timeout } from "puppeteer";

// Constants for timeout times
const TIMEOUT_SHORT = 2000;
const TIMEOUT_MEDIUM = 5000;
const TIMEOUT_LONG = 30000;
const DEFAULT_LOAD_STATE_TIMEOUT = 60000;  // Default timeout for waitForLoadState

export const unlockAd = async (page, url, password = "1111", inputRef = 'input[name="post_password"]', submitRef = 'input[name="Submit"]') => {
  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url);
    await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
    console.log(`Filling password: ${password}`);
    await page.fill(inputRef, password);
    await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
    console.log('Clicking submit button');
    await page.locator(submitRef).click();
    await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
    await page.waitForTimeout(TIMEOUT_SHORT);
    console.log('Ad unlocked');
  } catch (error) {
    console.error('Error in unlockAd:', error.message);
  }
};

export const getAdLink = async (page, link = 1, links = [], ref = 'a[rel="noreferrer noopener"]') => {
  console.log('Waiting for page body to load');
  await page.waitForSelector('body', { state: 'attached' });
  await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
  await page.waitForTimeout(TIMEOUT_SHORT);
  console.log(`Waiting for selector: ${ref}`);
  await page.waitForSelector(ref);
  await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });

  const elements = page.locator(ref);
  const count = await elements.count();
  console.log(`Found ${count} links with selector: ${ref}`);

  if (links.length === 0) {
    if (count > 0) {
      const newPage = await clickAndWait(page, elements.first(), 1);
      console.log('Clicked on the first link');
      await newPage.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
      return newPage;
    } else {
      console.log('No links found');
    }
    return page;
  }

  for (let i = 0; i < links.length; i++) {
    let l = links[i];
    if (l > 0 && l <= count) {
      await clickAndWait(page, elements.nth(l - 1), l);
      console.log(`Clicked on link number ${l}`);
    } else {
      console.log(`Invalid link number: ${l}. Total links: ${count}`);
    }
  }
  await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
  return page;
};
export const clickOnAdLink = async (page, type = "expression", ref = 'iframe') => {
  try {
    console.log(`Waiting for iframe with selector: ${ref}`);
    await page.waitForSelector(ref, { visible: true, timeout: TIMEOUT_LONG });

    const iframeElement = await page.$(ref);
    if (!iframeElement) {
      throw new Error(`Iframe with selector ${ref} not found`);
    }

    console.log('Iframe found, loading content');
    await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });

    const frameHandle = await iframeElement.contentFrame();
    if (!frameHandle) {
      throw new Error(`Failed to get iframe content frame`);
    }

    await frameHandle.waitForLoadState('domcontentloaded', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
    console.log('Iframe content loaded');

    const linkClicked = await frameHandle.evaluate(() => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const link = document.querySelector("a[aria-labelledby]") || document.querySelector("a[aria-label]");
          if (link && link.href.includes('trk.dtt360.com')) {
            link.click();
            clearInterval(interval);
            resolve({ href: link.href, text: link.textContent.trim() });
          }
        }, 1000); // Polling interval of 1 second
        setTimeout(() => {
          clearInterval(interval);
          resolve(null); // Resolve with null if link not found within timeout
        }, 5000);


      });
    });

    if (linkClicked) {
      console.log(`Clicked link: ${linkClicked.text}`);
      const newPagePromise = new Promise(resolve => page.context().once('page', resolve));
      const newPage = await newPagePromise;
      await newPage.waitForLoadState('domcontentloaded', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
      await newPage.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
      console.log('New page loaded:', await newPage.title());
      return newPage;
    } else {
      await page.reload({timeout : DEFAULT_LOAD_STATE_TIMEOUT});
      return await clickOnAdLink(page, type  ); // or handle accordingly
    }
  } catch (error) {
    console.error('Error during navigation:', error);
    throw error; // rethrow the error for higher-level handling
  }
};

const clickAndWait = async (page, element, index) => {
  console.log(`Clicking on element at index: ${index}`);
  const newPagePromise = new Promise(resolve => {
    page.context().once('page', resolve);
  });

  await element.click();
  await page.waitForTimeout(TIMEOUT_SHORT);
  const newPage = await newPagePromise;
  await newPage.waitForLoadState('domcontentloaded', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
  await newPage.waitForTimeout(TIMEOUT_SHORT);
  await newPage.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
  console.log('Navigation completed or new tab opened');
  return newPage;
};

export const clickOnAd = async (page, type = "expression", ref = '.adv-text-top') => {
  try {
    console.log("Waiting for", ref);
    await page.waitForSelector(ref, { visible: true, timeout: TIMEOUT_LONG });
    await page.waitForTimeout(TIMEOUT_LONG);
    await page.screenshot({ path: "adPage.png" });
    console.log("Expression done");

    const button = await page.waitForSelector('.adv-text-exp__title', { visible: true, timeout: TIMEOUT_LONG });
    if (type === "click") {
      if (button) {
        console.log('Button with class adv-text-exp__title clicked');
        return clickAndWait(page,button,1)
      } else {
        console.log('Button with class adv-text-exp__title not found');
      }
    }

    return page;
  } catch (error) {
    console.error('Error during ad click:', error);
    throw error; // Rethrow the error for higher-level handling
  }
};

export const clickOnSite = async (page) => {
  const endTime = Date.now() + DEFAULT_LOAD_STATE_TIMEOUT;
  while (Date.now() < endTime) {
    try {
      await randomScroll(page);
      clickRandomButtons(page);
      await randomScroll(page);
    } catch (error) {
      console.error('Error in clickOnSite iteration:', error.message);
    }
    await page.waitForTimeout(TIMEOUT_SHORT);
  }
  await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
};

async function clickRandomButtons(page, maxClicks = 1, delay = TIMEOUT_SHORT) {
  for (let i = 0; i < maxClicks; i++) {
    try {
      const buttons = await page.$$('button');
      if (buttons.length === 0) {
        console.log('No buttons found on the page.');
        break;
      }

      const randomIndex = Math.floor(Math.random() * buttons.length);
      const randomButton = buttons[randomIndex];
      const buttonText = await randomButton.evaluate(el => el.innerText.trim());
      console.log(`Clicking button: ${buttonText}`);

      await randomButton.click();
      console.log('Button clicked.');

      await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
      await page.waitForTimeout(delay);
      
    } catch (error) {
      console.error('Error during button click:', error.message);
    }
  }
}



async function randomScroll(page, maxScrolls = 5, maxScrollAmount = 800, minScrollAmount = 100, maxDelay = TIMEOUT_SHORT, minDelay = 500) {
  for (let i = 0; i < maxScrolls; i++) {
    try {
      const scrollAmount = Math.floor(Math.random() * (maxScrollAmount - minScrollAmount + 1)) + minScrollAmount;
      const scrollDirection = Math.random() < 0.5 ? -1 : 1;

      await page.evaluate(amount => window.scrollBy(0, amount), scrollAmount * scrollDirection);
      await page.waitForLoadState('networkidle', { timeout: DEFAULT_LOAD_STATE_TIMEOUT });
      console.log(`Scrolled ${scrollDirection > 0 ? 'down' : 'up'} by ${scrollAmount} pixels`);


      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      await page.waitForTimeout(delay);
    } catch (error) {
      console.error('Error during scrolling:', error.message);
    }
  }
}
