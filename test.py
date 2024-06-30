from seleniumbase import Driver

# Initialize Driver with Ultrafast Grid mode
driver = Driver(uc=True)

# URL to open
url = "https://www.browserscan.net/"

# Open URL with reconnect attempts
driver.uc_open_with_reconnect(url, 3)

# Take a screenshot
screenshot_path = "screenshot.png"
driver.save_screenshot(screenshot_path)
print(f"Screenshot saved to {screenshot_path}")

# Quit the driver
driver.quit()
