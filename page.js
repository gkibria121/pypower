import { timeout } from "puppeteer";

// Constants
const TIMEOUT = {
  SHORT: 2000,
  MEDIUM: 5000,
  LONG: 30000,
  DEFAULT_LOAD_STATE: 60000
};

// Utility functions
const waitForLoadState = async (page, state = 'networkidle', timeout = TIMEOUT.DEFAULT_LOAD_STATE) => {
  await page.waitForLoadState(state, { timeout });
};

const waitForSelector = async (page, selector, options = { visible: true, timeout: TIMEOUT.LONG }) => {
  await page.waitForSelector(selector, options);
};

const clickAndWaitForNewPage = async (page, element) => {
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    element.click()
  ]);
  await waitForLoadState(newPage);
  return newPage;
};

// Main functions
export const unlockAd = async (page, url, password = "1111", inputRef = 'input[name="post_password"]', submitRef = 'input[name="Submit"]') => {
  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url);
    await waitForLoadState(page);

    console.log(`Filling password: ${password}`);
    await page.fill(inputRef, password);
    await waitForLoadState(page);

    console.log('Clicking submit button');
    await page.locator(submitRef).click();
    await waitForLoadState(page);
    await page.waitForTimeout(TIMEOUT.SHORT);

    console.log('Ad unlocked');
  } catch (error) {
    console.error('Error in unlockAd:', error.message);
  }
};

export const getAdLink = async (page, link = 1, links = [], ref = 'a[rel="noreferrer noopener"]') => {
  console.log('Waiting for page body to load');
  await waitForSelector(page, 'body', { state: 'attached' });
  await waitForLoadState(page);
  await page.waitForTimeout(TIMEOUT.SHORT);

  console.log(`Waiting for selector: ${ref}`);
  await waitForSelector(page, ref);
  await waitForLoadState(page);

  const elements = page.locator(ref);
  const count = await elements.count();
  console.log(`Found ${count} links with selector: ${ref}`);

  if (links.length === 0 && count > 0) {
    return await clickAndWaitForNewPage(page, elements.first());
  }

  for (let l of links) {
    if (l > 0 && l <= count) {
      await clickAndWaitForNewPage(page, elements.nth(l - 1));
      console.log(`Clicked on link number ${l}`);
    } else {
      console.log(`Invalid link number: ${l}. Total links: ${count}`);
    }
  }

  await waitForLoadState(page);
  return page;
};
// Main function
export const clickOnAdLink = async (page, type = "expression", ref = 'iframe') => {
  try {
    console.log(`Waiting for iframe with selector: ${ref}`);
    await page.waitForSelector(ref);

    const iframe = await page.$(ref);
    if (!iframe) {
      console.log('Iframe not found');
      return null;
    }

    const frame = await iframe.contentFrame();
    if (!frame) {
      console.log('Unable to get iframe content');
      return null;
    }

    // Log all <a> tags in the iframe
    const links = await frame.$$eval('a', anchors => {
      return anchors.map(anchor => ({
        href: anchor.href,
        text: anchor.textContent.trim(),
        target: anchor.getAttribute('target'),
        rel: anchor.getAttribute('rel'),
        ariaLabel: anchor.getAttribute('aria-label'),
        ariaLabelledby: anchor.getAttribute('aria-labelledby'),
        role: anchor.getAttribute('role')
      }));
    });

    // Find the link containing "trk.dtt360.com"
    const targetLink = links.find((link) => {
      try {
        const decodedUrl = decodeURIComponent(link.href);
        return decodedUrl.includes("trk.dtt360.com");
      } catch {
        return false;
      }
    });

    if (targetLink) {
      console.log('Found link containing "trk.dtt360.com". Navigating to:', targetLink.href);
      const newPage = await page.context().newPage();
      await newPage.goto(targetLink.href, { waitUntil: 'networkidle', timeout: 60000 });
      console.log('New page loaded:', await newPage.title());
      return newPage;
    } else {
      console.log('No link containing "trk.dtt360.com" found');

      // Find all links with class 'post-page-numbers'
      const postPageNumbers = await page.$$('.post-page-numbers');
      
      // Filter out the link with text '2'
      const filteredLinks = await Promise.all(postPageNumbers.map(async link => {
        const textContent = await link.innerText();
        if (textContent.trim() !== '2') {
          return link;
        }
      }));
      
      // Filter out undefined elements
      const validLinks = filteredLinks.filter(link => link !== undefined);
      
      if (validLinks.length === 0) {
        console.log('No valid links found.');
        return null;
      }
      
      // Randomly choose a link to click
      const randomIndex = Math.floor(Math.random() * validLinks.length);
      const linkToClick = validLinks[randomIndex];
      
      // Get the href attribute of the link
      const href = await linkToClick.getAttribute('href');
      console.log(`Clicking link: ${href}`);
      
      // Click the link
      await linkToClick.click();
      
      await waitForLoadState(page)
      // Recursively call clickOnAdLink to continue the process
      return clickOnAdLink(page, type, ref);
 
    }

  } catch (error) {
    console.error('Error during navigation:', error);
    throw error;
  }
};

 

export const clickOnAd = async (page, type = "expression", ref = '.adv-text-top') => {
  try {
    console.log("Waiting for", ref);
    await waitForSelector(page, ref);
    await page.waitForTimeout(TIMEOUT.LONG); 
    console.log("Expression done");

    const button = await page.$('.adv-text-exp__title');
    if (type === "click" && button) {
      console.log('Button with class adv-text-exp__title clicked');
      return await clickAndWaitForNewPage(page, button);
    } else {
      console.log('Button with class adv-text-exp__title not found or not clicked');
    }

    return page;
  } catch (error) {
    console.error('Error during ad click:', error);
    throw error;
  }
};

export const clickOnSite = async (page) => {
  const endTime = Date.now() + TIMEOUT.DEFAULT_LOAD_STATE;
  while (Date.now() < endTime) {
    try {
      await randomScroll(page);
      await clickRandomLinks(page);
      await randomScroll(page);
    } catch (error) {
      console.error('Error in clickOnSite iteration:', error.message);
    }
    await page.waitForTimeout(TIMEOUT.SHORT);
  }
  await waitForLoadState(page);
};

async function clickRandomLinks(page, maxClicks = 1, delay = TIMEOUT.SHORT) {
  const originalUrl = page.url();

  for (let i = 0; i < maxClicks; i++) {
    try {
      const links = await page.$$('a[href]');
      if (links.length === 0) {
        console.log('No links found on the page.');
        break;
      }

      const randomLink = links[Math.floor(Math.random() * links.length)];
      const linkText = await randomLink.evaluate(el => el.innerText.trim() || el.getAttribute('href'));
      console.log(`Clicking link: ${linkText}`);

      const newPage = await clickAndWaitForNewPage(page, randomLink);
      console.log(`Navigated to: ${newPage.url()}`);

      await newPage.waitForTimeout(delay);
      await newPage.close();
      await page.bringToFront();
    } catch (error) {
      console.error('Error during link navigation:', error.message);
    }
  }

  if (page.url() !== originalUrl) {
    await page.goto(originalUrl);
  }
}

async function randomScroll(page, maxScrolls = 5, maxScrollAmount = 800, minScrollAmount = 100, maxDelay = TIMEOUT.SHORT, minDelay = 500) {
  for (let i = 0; i < maxScrolls; i++) {
    try {
      const scrollAmount = Math.floor(Math.random() * (maxScrollAmount - minScrollAmount + 1)) + minScrollAmount;
      const scrollDirection = Math.random() < 0.5 ? -1 : 1;

      await page.evaluate(amount => window.scrollBy(0, amount), scrollAmount * scrollDirection);
      await waitForLoadState(page);
      console.log(`Scrolled ${scrollDirection > 0 ? 'down' : 'up'} by ${scrollAmount} pixels`);

      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      await page.waitForTimeout(delay);
    } catch (error) {
      console.error('Error during scrolling:', error.message);
    }
  }
}

async function waitForFBPageAndEvaluate(page) {
  await page.waitForLoadState();

  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const link = document.querySelector("a[aria-labelledby]") ||
          document.querySelector("a[aria-label]") ||
          document.querySelector("a[*='1081.us.searchitbetter.com']");
        if (link && (link.href.includes('trk.dtt360.com') || link.ariaLabel.includes('1081.us.searchitbetter.com'))) {
          link.click();
          clearInterval(interval);
          resolve({ href: link.href, text: link.textContent.trim() });
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        resolve(null);
      }, 5000);
    });
  });

  return result;
}