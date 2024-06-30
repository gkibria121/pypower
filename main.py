import threading
import time
from Browser import Browser
def browser_task(proxy_str, ad_link, password):
    browser = Browser(proxy_str=proxy_str)
    browser.open_ad_link(ad_link)
    browser.enter_password_and_login(password)
    # Add any additional actions here
    time.sleep(180)  # Simulate some work
    browser.quit() # Assuming there's a method to close the browser

# List of proxy strings, ad links, and passwords
proxy_list = [
        "serv.dtt360.com:8000:Skhan:qGsg86afVQOnK-country-US-session-7Xx9B3Pb",
        "serv.dtt360.com:8000:Skhan:qGsg86afVQOnK-country-US-session-7Xx9B3Pb",
        "serv.dtt360.com:8000:Skhan:qGsg86afVQOnK-country-US-session-7Xx9B3Pb",
        "serv.dtt360.com:8000:Skhan:qGsg86afVQOnK-country-US-session-7Xx9B3Pb",
    ]
ad_link = "https://tinyshorten.com/Robel-SS"
password = 1111

threads = []

# Create and start 10 threads
for i in range(len(proxy_list)):
    thread = threading.Thread(target=browser_task, args=(proxy_list[i], ad_link , password))
    threads.append(thread)
    thread.start()

# Wait for all threads to complete
for thread in threads:
    thread.join()

print("All browser tasks completed")