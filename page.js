import fs from 'fs/promises';

export const unlockAd = async (page, url, password = "1111", inputRef = 'input[name="post_password"]', submitRef = 'input[name="Submit"]') => {
  await page.goto(url);
  await page.fill(inputRef, password);
  await page.locator(submitRef).click();
  await page.waitForTimeout(2000);
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
  try {
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector(ref, { visible: true, timeout: 100000 });

    const iframeElement = await page.$(ref);
    if (!iframeElement) {
      throw new Error(`Iframe with selector ${ref} not found`);
    }

    const frameHandle = await iframeElement.contentFrame();
    await frameHandle.waitForLoadState('domcontentloaded');

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

    } else {
      console.log('Link with "1081.us.searchitbetter.com" not found');
    }

    await page.waitForNavigation({ timeout: 30000 }).catch(() => {
      console.log('Navigation timeout, but continuing...');
    });


  } catch (error) {
    console.error(`Error in clickOnAd: ${error.message}`);
  }
};

export const clickAndCaptureNewTab = async (page, selector) => {
  const newPagePromise = new Promise(resolve => {
    page.context().once('page', resolve);
  });

  await page.click();

  const newPage = await newPagePromise;
  await newPage.waitForLoadState('domcontentloaded');
  await newPage.waitForTimeout(2000);

  return newPage;
};

const clickAndWait = async (page, element, index) => {
  try {
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
  } catch (error) {
    console.log('Error during click or navigation:', error.message);
  }
};