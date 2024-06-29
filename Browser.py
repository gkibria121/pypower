from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from Framework.Container import Container
from App.ChromeOptions.ChromeOptions import  ChromeOptions 
from selenium_stealth import stealth
class Browser:
    def __init__(self, user_agent=None, proxy_str=None, arguments=[]):
 
        self.container= Container()

        self.options = self.prepare_options(Options(),user_agent , proxy_str, arguments)
        self.driver = self.create_driver(self.options)
        self.driver = self.process_driver(self.driver) 


    def create_driver(self, options):
        capabilities = DesiredCapabilities.CHROME
        capabilities['goog:loggingPrefs'] = {'performance': 'ALL'}
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=options,keep_alive=True)
         
        return driver

    def open_url(self, url):
        self.wait = WebDriverWait(self.driver, 10)
        # Open a blank tab
        self.driver.get(url)
        # self.driver.get(url)
        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        return self.driver.page_source

    def prepare_options(self,options,user_agent=None, proxy_str=None, arguments=[]):
    
        chrome_options = ChromeOptions(options,user_agent, proxy_str, arguments)
        return chrome_options.create_options()


    def process_driver(self,driver):

        return self.container.get_driver_processor().run(driver)
     



 