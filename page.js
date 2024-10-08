//page.js

// Constants
const TIMEOUT = {
  SHORT: 2000,
  MEDIUM: 5000,
  LONG: 30000,
  DEFAULT_LOAD_STATE: 100000,
};
const MaxTry = {
  unlockAd: 2,
  getAdLink: 2,
  clickOnAdLink: 3,
  clickOnAd: 1,
};
// Utility functions
const waitForLoadState = async (page, state = "networkidle", timeout = TIMEOUT.DEFAULT_LOAD_STATE) => {
  await page.waitForLoadState(state, { timeout });
};

const clickAndWaitForNewPage = async (page, element) => {
  const [newPage] = await Promise.all([page.context().waitForEvent("page"), element.click()]);
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

    console.log("Clicking submit button");
    await page.locator(submitRef).click();
    await waitForLoadState(page);
    await page.waitForTimeout(TIMEOUT.SHORT);

    console.log("Ad unlocked");
  } catch (error) {
    console.error("Error in unlockAd:", error.message);
  }
};

export const getAdLink = async (page, task = 1, links = [], ref = 'a[rel="noreferrer noopener"]') => {
  console.log("Waiting for page body to load");
  await page.waitForSelector("body", { state: "attached" });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(TIMEOUT.SHORT);

  console.log(`Waiting for selector: ${ref}`);
  await page.waitForSelector(ref);
  await page.waitForLoadState("domcontentloaded");

  const elements = page.locator(ref);
  const count = await elements.count();
  console.log(`Found ${count} links with selector: ${ref}`);

  if (task > 0 && task <= count) {
    console.log(`Clicking on link number ${task}`);
    return await clickAndWaitForNewPage(page, elements.nth(task - 1));
  } else {
    console.log(`Invalid task number: ${task}. Total links: ${count}`);
    return page;
  }
};

// Main function
export const clickOnAdLink = async (page, type = "expression", ref = "iframe", max = 3) => {
  try {
    console.log(`Waiting for iframe with selector: ${ref}`);
    await page.waitForFunction('document.readyState === "complete"');
    // Now wait for the specific element to appear
    await page.waitForSelector(ref);

    const iframe = await page.$(ref);
    if (!iframe) {
      console.log("Iframe not found");
      return null;
    }

    const frame = await iframe.contentFrame();
    if (!frame) {
      console.log("Unable to get iframe content");
      return null;
    }

    // Log all <a> tags in the iframe
    const links = await frame.$$eval("a", (anchors) => {
      return anchors.map((anchor) => ({
        href: anchor.href,
        text: anchor.textContent.trim(),
        target: anchor.getAttribute("target"),
        rel: anchor.getAttribute("rel"),
        ariaLabel: anchor.getAttribute("aria-label"),
        ariaLabelledby: anchor.getAttribute("aria-labelledby"),
        role: anchor.getAttribute("role"),
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
      await newPage.goto(targetLink.href, { waitUntil: "domcontentloaded", timeout: TIMEOUT.DEFAULT_LOAD_STATE + 10000 });
      console.log("New page loaded:", await newPage.title());
      return newPage;
    } else {
      console.log('No link containing "trk.dtt360.com" found');

      // Find all links with class 'post-page-numbers'
      const postPageNumbers = await page.$$(".post-page-numbers");

      // Filter out the link with text '2'
      const filteredLinks = await Promise.all(
        postPageNumbers.map(async (link) => {
          const textContent = await link.innerText();
          if (textContent.trim() !== "2") {
            return link;
          }
        })
      );

      // Filter out undefined elements
      const validLinks = filteredLinks.filter((link) => link !== undefined);

      if (validLinks.length === 0) {
        console.log("No valid links found.");
        return null;
      }

      // Randomly choose a link to click
      const randomIndex = Math.floor(Math.random() * validLinks.length);
      const linkToClick = validLinks[randomIndex];

      // Get the href attribute of the link
      const href = await linkToClick.getAttribute("href");
      console.log(`Clicking link: ${href}`);

      // Click the link
      await linkToClick.click();

      await waitForLoadState(page);
      // Recursively call clickOnAdLink to continue the process

      if (max) {
        return clickOnAdLink(page, type, ref, max - 1);
      } else {
        throw new Error("ClickOnAdLink not working");
      }
    }
  } catch (error) {
    console.error("Error during navigation:", error);
    throw error;
  }
};

export const clickOnAd = async (page, type = "expression") => {
  console.log("Waiting for page load");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout( TIMEOUT.LONG );
 
  console.log("Page loaded");

  if (type === "click") {
    // Find all 'a' tags containing 'www'
    // Get all links containing the text "www"
    const wwwTextLinks = await page.locator('a:has-text("www")').evaluateAll((links) => links.map((link) => link.href) ) ;

    // Combine and deduplicate the links
    const wwwLinks = [...new Set([...wwwTextLinks])];
    const count = wwwLinks.length;

    if (count > 0) {
      console.log(`Found ${count} link(s) containing "www"`);
      let index = 0;
      while (true) {
        try {
          const firstLink = wwwLinks[index];

          // Get the href attribute
          const href = firstLink;

          console.log(`Clicking link with href: ${href}`);

          // Open a new page with this URL
          const newPage = await page.context().newPage();
          await newPage.goto(href, { waitUntil: "domcontentloaded", timeout: TIMEOUT.DEFAULT_LOAD_STATE });

          console.log("Opened in new page");
          return newPage;
        } catch (error) {
          if (index > 3) {
            throw new Error("Link is not opening");
          }
          index += 1;
        }

        // Get the first link
      }
    } else {
      console.log('No link with "www" found.');
      throw new Error('No link with "www" found.');
    }
  } else {
    console.log('Type is not "click". No action taken.');
  }

  return page;
};
export const clickOnSite = async (page) => {
  const endTime = Date.now() + TIMEOUT.DEFAULT_LOAD_STATE;
  while (Date.now() < endTime) {
    try {
      await randomScroll(page);
      await clickRandomLinks(page);
      await randomScroll(page);
    } catch (error) {
      console.error("Error in clickOnSite iteration:", error.message);
    }
    await page.waitForTimeout(TIMEOUT.MEDIUM);
  }
};

async function clickRandomLinks(page, maxClicks = 1, delay = 5000) {
  const originalUrl = new URL(page.url());

  for (let i = 0; i < maxClicks; i++) {
    try {
      const links = await page.$$("a[href]");
      if (links.length === 0) {
        console.log("No links found on the page.");
        break;
      }

      const randomLink = links[Math.floor(Math.random() * links.length)];
      const href = await randomLink.getAttribute("href");
      const linkUrl = new URL(href, originalUrl.origin);
      const linkText = await randomLink.innerText();

      console.log(`Clicking link: ${linkText}`);

      if (linkUrl.hostname === originalUrl.hostname) {
        // If the link is in the same domain, click it
        await randomLink.click();
        await page.waitForLoadState("domcontentloaded");
      } else {
        // If the link is to a different domain, open in a new tab but stay on current tab
        const [newPage] = await Promise.all([
          page.context().waitForEvent("page"),
          randomLink.click({ modifiers: ["Meta"] }), // 'Meta' for Mac, use 'Control' for Windows/Linux
        ]);
        await newPage.close();
      }

      await page.waitForTimeout(delay);
    } catch (error) {
      console.error("Error during link navigation:", error.message);
    }
  }
}

async function randomScroll(page, maxScrolls = 5, maxScrollAmount = 800, minScrollAmount = 100, maxDelay = TIMEOUT.SHORT, minDelay = 500) {
  for (let i = 0; i < maxScrolls; i++) {
    try {
      const scrollAmount = Math.floor(Math.random() * (maxScrollAmount - minScrollAmount + 1)) + minScrollAmount;
      const scrollDirection = Math.random() < 0.5 ? -1 : 1;

      await page.evaluate((amount) => window.scrollBy(0, amount), scrollAmount * scrollDirection);

      // await waitForLoadState(page);
      console.log(`Scrolled ${scrollDirection > 0 ? "down" : "up"} by ${scrollAmount} pixels`);

      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      await page.waitForTimeout(delay);
    } catch (error) {
      console.error("Error during scrolling:", error.message);
    }
  }
}
