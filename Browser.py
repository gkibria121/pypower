from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from Framework.Container import Container
from App.ChromeOptions.ChromeOptions import ChromeOptions 
from selenium_stealth import stealth
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time 
import random
class Browser:
    def __init__(self, user_agent=None, proxy_str=None, arguments=[]):
        self.container = Container()
        self.options = self.prepare_options(Options(), user_agent, proxy_str, arguments)
        self.driver = self.create_driver(self.options)
        self.driver = self.process_driver(self.driver)

    def create_driver(self, options):
        capabilities = DesiredCapabilities.CHROME
        capabilities['goog:loggingPrefs'] = {'performance': 'ALL'}
        driver = webdriver.Chrome(service=Service(executable_path="Drivers/uc_driver.exe"), options=options, keep_alive=True)
        return driver



    def prepare_options(self, options, user_agent=None, proxy_str=None, arguments=[]):
        chrome_options = ChromeOptions(options, user_agent, proxy_str, arguments)
        return chrome_options.create_options()

    def process_driver(self, driver):
        return self.container.get_driver_processor().run(driver)


    def open_ad_link(self, url):
        try:
            # Open a blank tab
            self.driver.execute_script("window.open('');")
            time.sleep(random.uniform(0.5, 1.5))

            # Close the blank tab
            self.driver.switch_to.window(self.driver.window_handles[-1])
            self.driver.close()
            self.driver.switch_to.window(self.driver.window_handles[0])
            time.sleep(random.uniform(0.5, 1.5))

            # Navigate to common URL
            common_url = "https://www.browserscan.net/"
            self.driver.get(common_url)
            WebDriverWait(self.driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            # Open a new tab
            self.driver.execute_script("window.open('');")
            time.sleep(random.uniform(0.5, 1.5))

            # Switch to the new tab
            self.driver.switch_to.window(self.driver.window_handles[-1])

            # Navigate to the target URL
            self.driver.get(url)
            WebDriverWait(self.driver, 15).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

            # Simulate more random scrolling
            total_height = int(self.driver.execute_script("return document.body.scrollHeight"))
            for _ in range(random.randint(5, 10)):
                scroll_height = random.randint(100, 300)
                self.driver.execute_script(f"window.scrollBy(0, {scroll_height});")
                time.sleep(random.uniform(0.5, 2.0))

        except TimeoutException:
            print("Page load timed out. Proceeding with caution.")
        except NoSuchElementException:
            print("Expected element not found. The page structure might have changed.")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
    
    def enter_password_and_login(self, password):
        try:
            # Wait for the password input field to be present
            password_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "post_password"))
            )
            
            # Enter the password
            password_input.send_keys(password)
            
            # Find the submit button
            submit_button = self.driver.find_element(By.XPATH, "//input[@type='submit' and @name='Submit' and @value='Enter']")
            
            # Click the submit button
            submit_button.click()
            
            # Wait for the page to load after submission
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            print("Password entered and form submitted successfully.")
        
        except Exception as e:
            print(f"An error occurred while entering password: {str(e)}")

    def close(self):
        self.driver.close()

    