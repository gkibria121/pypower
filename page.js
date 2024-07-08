import fs from 'fs/promises';
export const unlockAd = async (page, url, password = "1111" , inputRef='input[name="post_password"]',submitRef='input[name="Submit"]') => {
    await page.goto(url);
    // Insert the value into the input field
    await page.fill(inputRef, password);
    await page.locator(submitRef).click();
 
    await page.waitForTimeout(2000); // wait for 2 seconds
  };
  
  export const clickOnAdLink = async (page, link = 1, links = [] ,ref='a[rel="noreferrer noopener"]') => {
    // Wait for the body to be ready
    await page.waitForSelector('body', { state: 'attached' });
 
    await page.waitForTimeout(2000); // wait for 2 seconds
  
    // Wait for the links to be available
    await page.waitForSelector(ref);
  
    const elements = page.locator(ref);
    const count = await elements.count();
  

  
    if (links.length === 0) {
      if (count > 0) {
        const newPage = await clickAndWait(page,elements.first(), 1);
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
        await clickAndWait(page,elements.nth(l - 1), l);
        console.log(`Clicked on link number ${l}`);
      } else {
        console.log(`Invalid link number: ${l}. Total links: ${count}`);
      }
    }
    return page;
  };
  

 

  export const clickOnAd = async (page, ref = 'iframe') => {
    try {
        await page.screenshot({ path: 'willclick.png' });
        console.log(`Waiting for iframe: ${ref}`);

        await page.reload({ waitUntil: 'networkidle0' });
        
        // Wait for the iframe to be visible
        await page.waitForSelector(ref, { visible: true, timeout: 100000 });

        // Get the iframe element
        const iframeElement = await page.$(ref);
        if (!iframeElement) {
            throw new Error(`Iframe with selector ${ref} not found`);
        }

        // Wait for the iframe content to load
        const frameHandle = await iframeElement.contentFrame();
        await frameHandle.waitForLoadState('domcontentloaded');

        console.log('Iframe loaded. Now searching for the specific link.');

        // Find and click the specific link
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
            console.log(`Clicked link: ${linkClicked.text} (${linkClicked.href})`);
        } else {
            console.log('Link with "1081.us.searchitbetter.com" not found');
        }

        // Wait for navigation after clicking the link
        await page.waitForNavigation({ timeout: 30000 }).catch(() => {
            console.log('Navigation timeout, but continuing...');
        });

        // Get the content of the new page
        const newPageContent = await page.content();
        await fs.writeFile('new_page_content.html', newPageContent);
        console.log('New page content saved to new_page_content.html');

        await page.screenshot({ path: 'after_link_click.png' });

    } catch (error) {
        console.error(`Error in clickOnAd: ${error.message}`);
        // Optional: throw error to handle it in the calling function
        // throw error;
    }
};
  export const clickAndCaptureNewTab = async (page, selector) => {
    // Create a promise that will resolve with the new page
    const newPagePromise = new Promise(resolve => {
      page.context().once('page', resolve);
    });
  
    // Click the element that opens a new tab
    await page.click();
  
    // Wait for the new page to open and return it
    const newPage = await newPagePromise;
    await newPage.waitForLoadState('domcontentloaded');
    await newPage.waitForTimeout(2000); // wait for 2 seconds
  
    return newPage;
  };
  
  const clickAndWait = async (page,element, index) => {
    try {
      // Create a promise that will resolve with the new page
      const newPagePromise = new Promise(resolve => {
        page.context().once('page', resolve);
      });

      // Click the element that opens a new tab
      await element.click();
      // await page.screenshot({ path: `clickedLink${index}.png` });
      await page.waitForTimeout(2000); // wait for 2 seconds

      // Wait for the new page to open and return it
      const newPage = await newPagePromise;
      await newPage.waitForLoadState('domcontentloaded');
      // await newPage.screenshot({ path: `newTab${index}.png` });
      await newPage.waitForTimeout(2000); // wait for 2 seconds

      console.log('Navigation completed or new tab opened');
      return newPage;
    } catch (error) {
      console.log('Error during click or navigation:', error.message);
    }
  };