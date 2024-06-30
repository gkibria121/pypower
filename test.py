import json
import random
import time
import requests
from fake_useragent import UserAgent
from selenium import webdriver
from selenium.common import NoSuchElementException, WebDriverException
from selenium.webdriver.chrome.options import Options
from seleniumbase import Driver
from seleniumbase import SB
from random import randint, seed
from fake_useragent import UserAgent
from selenium_stealth import stealth

def get_apple_account_id():
    try:
        time.sleep(3)
        apple_registration_url = "https://www.browserscan.net/"
        proxy_host = 'Skhan:qGsg86afVQOnK@serv.dtt360.com:8000'
        args = '"--lang=en-US","--disable-web-security","--disable-gpu","--no-sandbox","--disable-dev-shm-usage","--disable-features=NetworkService","--disable-features=VizDisplayCompositor","--disable-software-rasterizer"'
        start_time = time.time()
        ua = UserAgent()
        while True:
            random_user_agent = ua.chrome
            if "Windows" not in random_user_agent:
                print(random_user_agent)
                continue
            break
        driver = Driver(uc=True, headless=False, uc_subprocess=True, uc_cdp_events=True, uc_cdp=True,
                        log_cdp=True, log_cdp_events=True, undetectable=True, chromium_arg=args,
                        swiftshader=True, agent=random_user_agent, proxy=proxy_host)
        stealth(
            driver,
            languages=["en-US", "en"],
            vendor="Google Inc.",
            platform="Win32",
            webgl_vendor="Intel Inc.",
            renderer="Intel Iris OpenGL Engine",
            fix_hairline=True,
        )
        driver.set_window_rect(randint(4, 720), randint(8, 410), 700, 900)
        driver.uc_open_with_reconnect(apple_registration_url, reconnect_time=10)
        stop_time = time.time()
        print("seleniumbase time:", stop_time - start_time)
        time.sleep(5000)


    except Exception as e:
        print(f"错误: {e}")
    finally:
        # 不论是否发生异常，最后都关闭浏览器窗口
        # driver.quit()
        pass





if __name__ == '__main__':
    get_apple_account_id()

