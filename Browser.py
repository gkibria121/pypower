from seleniumbase import Driver
import time

class Browser:
    def __init__(self, uc=True,proxy_str=None):
        self.driver = Driver(uc=uc,proxy=proxy_str)

    def open_url(self, url, reconnect_attempts=3):
        self.driver.uc_open_with_reconnect(url, reconnect_attempts)
         

    def quit(self):
        self.driver.quit()

# Example usage
if __name__ == "__main__":
    # Create an instance of Browser
    browser = Browser()
    
    # Define the URL to open
    url = "https://www.browserscan.net"
    
    # Open the URL with reconnect attempts
    page_source = browser.open_url(url)
    time.sleep(20)
    
    # Do something with the page source, e.g., print it
    print(page_source)
    
    # Quit the browser driver
    browser.quit()
