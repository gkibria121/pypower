from seleniumbase import Driver

driver = Driver(uc=True)
url = "https://www.browserscan.net"
driver.uc_open_with_reconnect(url, 3)
input()
 