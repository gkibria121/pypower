// automation.js

import fs from 'fs';
import { automateTask } from './main.js';
import { parseProxyString } from './proxy.js';

class ProxyAutomator {
  constructor(proxyFile = 'proxylist.txt', timeoutBetweenTasks = 3000) {
    this.PROXY_FILE = proxyFile;
    this.TIMEOUT_BETWEEN_TASKS = timeoutBetweenTasks;
    this.proxyList = [];
  }

  readProxyList() {
    try {
      const data = fs.readFileSync(this.PROXY_FILE, 'utf-8');
      this.proxyList = data.split('\n').filter(proxy => proxy.trim() !== '').map((proxy) => proxy.replace('\r', ''));
      console.log(`Read ${this.proxyList.length} proxies from file.`);
    } catch (error) {
      console.error(`Error reading proxy list: ${error}`);
      this.proxyList = [];
    }
  }

  writeProxyList() {
    try {
      fs.writeFileSync(this.PROXY_FILE, this.proxyList.join('\n'), 'utf-8');
      console.log(`Updated proxy list written to file.`);
    } catch (error) {
      console.error(`Error writing proxy list: ${error}`);
    }
  }

  removeProxyFromList(proxy) {
    this.proxyList = this.proxyList.filter(p => p !== proxy);
    console.log(`Removed proxy: ${proxy}. ${this.proxyList.length} proxies remaining.`);
  }

  async automateWithProxy(proxyString, taskType) {
    const proxy = parseProxyString(proxyString);
    try {
      console.log(`Starting ${taskType} task with proxy: ${proxyString}`);
      await automateTask(proxy, taskType, 1, "https://tinyshorten.com/Tasin-SS");
      console.log(`${taskType} task completed with proxy: ${proxyString}`);
    } catch (error) {
      console.error(`Error with proxy ${proxyString}:`, error);
    }
  }

  async run() {
    this.readProxyList();

    while (this.proxyList.length >= 2) {
      const expressionProxy = this.proxyList.shift();
      const clickProxy = this.proxyList.shift();

      if (!expressionProxy || !clickProxy) {
        console.error('Proxies are null or undefined.');
        break;
      }

      await this.automateWithProxy(expressionProxy, 'click');

      await new Promise(resolve => setTimeout(resolve, this.TIMEOUT_BETWEEN_TASKS));

      await this.automateWithProxy(clickProxy, 'click');

      this.removeProxyFromList(expressionProxy);
      this.removeProxyFromList(clickProxy);
      this.writeProxyList();
    }

    console.log('All tasks completed or insufficient proxies.');
  }
}

const main = async () => {
  const automator = new ProxyAutomator();
  await automator.run();
};

main();