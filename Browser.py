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
        self.time_zone = 'America/New_York'
    def get_random_user_agent(self):
        ua = UserAgent()
        while True:
            random_user_agent = ua.chrome
            if "Windows" in random_user_agent:
                return random_user_agent

    def setup_driver(self):
        proxy_host = self.proxy
        args = """--lang=en-US,
            --disable-gpu,
            --disable-dev-shm-usage,
            --enable-dns-over-https --dns-over-https-servers="https://dns.google/dns-query",
            --dns-prefetch-disable,
            --disable-features=VizDisplayCompositor,
            --disable-webrtc"""
        # --disable-web-security,  --no-sandbox,   --disable-features=NetworkService, --disable-software-rasterize
        random_user_agent = self.get_random_user_agent()
        
        self.driver = Driver(
            uc=True, headless=False, uc_subprocess=True, uc_cdp_events=True,
            uc_cdp=True, log_cdp=True, log_cdp_events=True, undetectable=True,
            chromium_arg=args, swiftshader=True, agent=random_user_agent, proxy=proxy_host,
            extension_dir="Extensions/TimeZoneChanger",
            # server="http://127.0.0.1",
            # port="4444"
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
 
        # self.driver.set_window_rect(randint(4, 720), randint(8, 410), 700, 900)
 
    def open_browserscan(self):
        try:
            self.setup_driver()
            apple_registration_url = "https://www.browserscan.net"
            self.set_timezone()
            self.driver.uc_open_with_reconnect(apple_registration_url, reconnect_time=10)
            time.sleep(60)

        except Exception as e:
            print(f"Error: {e}")

        finally:
            if self.driver:
                self.driver.quit()

    def set_timezone(self):
        tz_params = {'timezoneId': self.time_zone}
        self.driver.execute_cdp_cmd('Emulation.setTimezoneOverride', tz_params)

 