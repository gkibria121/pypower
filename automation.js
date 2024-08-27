//automation.js

import fs from 'fs';
import { automateTask } from './main.js';
import { parseProxyString } from './proxy.js';

const PROXY_FILE = 'proxylist.txt';
const TIMEOUT_BETWEEN_TASKS = 3000;

const readProxyList = () => {
  try {
    const data = fs.readFileSync(PROXY_FILE, 'utf-8');
    const proxies = data.split('\n').filter(proxy => proxy.trim() !== '').map((proxy)=> proxy.replace('\r','')  );
    console.log(`Read ${proxies.length} proxies from file.`);
    return proxies;
  } catch (error) {
    console.error(`Error reading proxy list: ${error}`);
    return [];
  }
};

const writeProxyList = (proxies) => {
  try {
    fs.writeFileSync(PROXY_FILE, proxies.join('\n'), 'utf-8');
    console.log(`Updated proxy list written to file.`);
  } catch (error) {
    console.error(`Error writing proxy list: ${error}`);
  }
};

const removeProxyFromList = (proxyList, proxy) => {
  const updatedList = proxyList.filter(p => p !== proxy);
  console.log(`Removed proxy: ${proxy}. ${updatedList.length} proxies remaining.`);
  return updatedList;
};

const automateWithProxy = async (proxyString, taskType) => {
  const proxy = parseProxyString(proxyString);
  try {
    console.log(`Starting ${taskType} task with proxy: ${proxyString}`);
    await automateTask(proxy, taskType,1, "https://tinyshorten.com/Tasin-SS");
    console.log(`${taskType} task completed with proxy: ${proxyString}`);
  } catch (error) {
    console.error(`Error with proxy ${proxyString}:`, error);
  }
};

const main = async () => {
  let proxyList = readProxyList();

  while (proxyList.length >= 2) { // Ensure there are at least two proxies for both tasks
    const expressionProxy = proxyList.shift(); // Remove the first proxy for 'expression' task
    const clickProxy = proxyList.shift(); // Remove the second proxy for 'click' task

    if (!expressionProxy || !clickProxy) {
      console.error('Proxies are null or undefined.');
      break;
    }

    await automateWithProxy(expressionProxy, 'click');

    setTimeout(async () => {
      await automateWithProxy(clickProxy, 'click');

      // Remove the used proxies from the list and save the updated list
      proxyList = removeProxyFromList(proxyList, expressionProxy);
      proxyList = removeProxyFromList(proxyList, clickProxy);
      writeProxyList(proxyList);

      // Continue to the next pair of tasks
      main();
    }, TIMEOUT_BETWEEN_TASKS);
    
    break; // Exit loop to avoid overlapping setTimeout calls
  }

  console.log('All tasks completed or insufficient proxies.');
};

main();
