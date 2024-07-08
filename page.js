export const unlockAd = async (page, url, password = "1111", inputRef = 'input[name="post_password"]', submitRef = 'input[name="Submit"]') => {
  try {
    await page.goto(url);
    await page.fill(inputRef, password);
    await page.locator(submitRef).click();
    await page.waitForTimeout(2000);
  } catch (error) {
    console.error('Error in unlockAd:', error.message);
  }
};

export const getAdLink = async (page, link = 1, links = [], ref = 'a[rel="noreferrer noopener"]') => {

    await page.waitForSelector('body', { state: 'attached' });
    await page.waitForTimeout(2000);
    await page.waitForSelector(ref);

    const elements = page.locator(ref);
    const count = await elements.count();

    if (links.length === 0) {
      if (count > 0) {
        const newPage = await clickAndWait(page, elements.first(), 1);
        console.log('Clicked on the first link');
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
    return page;

};

export const clickOnAdLink = async (page, ref = 'iframe') => {
 
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector(ref, { visible: true, timeout: 60000 });

    const iframeElement = await page.$(ref);
    if (!iframeElement) {
      throw new Error(`Iframe with selector ${ref} not found`);
    }

    const frameHandle = await iframeElement.contentFrame();
    await frameHandle.waitForLoadState('domcontentloaded');
    
    const newPagePromise = new Promise(resolve => page.context().once('page', resolve));

    const linkClicked = await frameHandle.evaluate(() => {
      const links = Array.from(document.links);
      for (const link of links) {
        if (link.href.includes('1081.us.searchitbetter.com') || 
            link.textContent.includes('1081.us.searchitbetter.com')) {
          link.click();
          return { href: link.href, text: link.textContent.trim() };
        }
      }
      return null;
    });

    if (linkClicked) {
      console.log(`Clicked link: ${linkClicked.text}`);

      const newPage = await newPagePromise;
      await newPage.waitForLoadState('domcontentloaded');

      console.log('New page loaded');
      return newPage;
    } else {
      console.log('Link with "1081.us.searchitbetter.com" not found');
      return page;  
    }
 
};

const clickAndWait = async (page, element, index) => {
 
    const newPagePromise = new Promise(resolve => {
      page.context().once('page', resolve);
    });

    await element.click();
    await page.waitForTimeout(2000);

    const newPage = await newPagePromise;
    await newPage.waitForLoadState('domcontentloaded');
    await newPage.waitForTimeout(2000);

    console.log('Navigation completed or new tab opened');
    return newPage;
 
};

export const clickOnAd = async (page, ref = '.adv-text-top') => {
 
    console.log("Waiting for", ref);
    await page.waitForSelector(ref, { visible: true, timeout: 60000 });
    await page.waitForTimeout(60000);
    await page.screenshot({ path: "adPage.png" });

    const button = await page.waitForSelector('.adv-text-exp__title', { visible: true, timeout: 60000 });
    if (button) {
      console.log('Button with class adv-text-exp__title clicked');
      await clickAndWait(page, button);
      
      await page.waitForSelector(ref, { hidden: true, timeout: 60000 });
      console.log('Button with class adv-text-exp__title has disappeared');
    } else {
      console.log('Button with class adv-text-exp__title not found');
    }

    return page;
 
};

export const clickOnSite = async (page) => {
 
    const endTime = Date.now() + 70000;
    while (Date.now() < endTime) {
      try {
        await randomScroll(page);
        await clickRandomLinks(page);
      } catch (error) {
        console.error('Error in clickOnSite iteration:', error.message);
      }
      await page.waitForTimeout(10000);
      // await page.reload({ waitUntil: 'domcontentloaded' });
    }
 
};

async function clickRandomLinks(page, maxClicks = 1, delay = 3000) {
  for (let i = 0; i < maxClicks; i++) {
    try {
      const links = await page.$$('a[href]');
      if (links.length === 0) {
        console.log('No links found on the page.');
        break;
      }
      
      const randomIndex = Math.floor(Math.random() * links.length);
      const randomLink = links[randomIndex];
      const href = await randomLink.evaluate(el => el.getAttribute('href'));
      console.log(`Clicking link: ${href}`);
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: delay * 10 }),
        randomLink.click()
      ]);
      
      console.log('Navigation complete');
      await page.waitForTimeout(delay);

      await page.goBack({ waitUntil: 'domcontentloaded', timeout: delay * 10 });
      console.log('Navigated back to previous page');
      await page.waitForTimeout(delay);
    } catch (error) {
      console.error('Error during link click:', error.message);
    }
  }
}

async function randomScroll(page, maxScrolls = 5, maxScrollAmount = 800, minScrollAmount = 100, maxDelay = 2000, minDelay = 500) {
  for (let i = 0; i < maxScrolls; i++) {
    try {
      const scrollAmount = Math.floor(Math.random() * (maxScrollAmount - minScrollAmount + 1)) + minScrollAmount;
      const scrollDirection = Math.random() < 0.5 ? -1 : 1;
      
      await page.evaluate(amount => window.scrollBy(0, amount), scrollAmount * scrollDirection);
      console.log(`Scrolled ${scrollDirection > 0 ? 'down' : 'up'} by ${scrollAmount} pixels`);
      
      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      await page.waitForTimeout(delay);
    } catch (error) {
      console.error('Error during scrolling:', error.message);
    }
  }
}
