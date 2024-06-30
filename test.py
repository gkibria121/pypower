from seleniumbase import SB
import time

with SB(uc=True, proxy="serv.dtt360.com:8000:Skhan:qGsg86afVQOnK-country-US-session-7Xx9B3Pb") as sb:
    url = "https://www.browserscan.net/"
    sb.driver.uc_open_with_reconnect(url, 4)
    time.sleep(10)