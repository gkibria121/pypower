import time
from random import randint
from fake_useragent import UserAgent
from seleniumbase import Driver
from selenium_stealth import stealth
from bs4 import BeautifulSoup
import json
class Browser:
    def __init__(self,proxy):
        self.driver = None
        self.proxy = proxy

    def get_random_user_agent(self):
        ua = UserAgent()
        while True:
            random_user_agent = ua.chrome
            if "Windows" in random_user_agent:
                return random_user_agent

    def setup_driver(self):
        proxy_host = self.proxy
        args = """--lang=en-US,
            --disable-web-security,
            --disable-gpu,
            --no-sandbox,
            --disable-dev-shm-usage,
            --disable-features=NetworkService,
            --disable-features=VizDisplayCompositor,
            --disable-software-rasterize"""
        random_user_agent = self.get_random_user_agent()
        
        self.driver = Driver(
            uc=True, headless=False, uc_subprocess=True, uc_cdp_events=True,
            uc_cdp=True, log_cdp=True, log_cdp_events=True, undetectable=True,
            chromium_arg=args, swiftshader=True, agent=random_user_agent, proxy=proxy_host
        )
        stealth(
            self.driver,
            languages=["en-US", "en"],
            vendor="Google Inc.",
            platform="Win32",
            webgl_vendor="Intel Inc.",
            renderer="Intel Iris OpenGL Engine",
            fix_hairline=True
        )
        self.update_time_zone()
        # self.driver.set_window_rect(randint(4, 720), randint(8, 410), 700, 900)
    def update_time_zone(self):
        self.driver.get("https://ipinfo.io/json")
        page_source = self.driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        pre_tag =soup.find("pre")
        ip_info = json.loads(pre_tag.get_text())
         
        print(ip_info)
        tz_params = {'timezoneId': ip_info['timezone']}
        time_zone = ip_info['timezone']  # Example: Eastern Time (US & Canada)
        script = f"Intl.DateTimeFormat().resolvedOptions().timeZone = '{time_zone}';"
        self.driver.execute_script(script)

    def open_browserscan(self):
        try:
            self.setup_driver()
            apple_registration_url = "https://www.browserscan.net/"
            start_time = time.time()
            self.driver.uc_open_with_reconnect(apple_registration_url, reconnect_time=10)
            stop_time = time.time()
            print("SeleniumBase time:", stop_time - start_time)
            time.sleep(60)

        except Exception as e:
            print(f"Error: {e}")

        finally:
            if self.driver:
                self.driver.quit()

if __name__ == '__main__':
    browser = Browser('Skhan:qGsg86afVQOnK@serv.dtt360.com:8000')
    browser.open_browserscan()
