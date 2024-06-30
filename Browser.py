from seleniumbase import Driver
from Framework.Container import Container 
from selenium_stealth import stealth
class Browser:
    def __init__(self, user_agent=None, proxy_str=None, arguments=[]):
 
        self.container= Container()
        self.driver =   self.create_driver()
 


    def create_driver(self):
        driver = Driver(uc=True,headless=False)
        
         
        return driver

    def open_url(self, url):
        self.driver.uc_open_with_reconnect(url)
        return self.driver.page_source

 

    def process_driver(self,driver):

        return self.container.get_driver_processor().run(driver)
     



 