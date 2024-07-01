from Browser import Browser
from threading import Thread
import time


def open_browser():
    browser = Browser('Skhan:qGsg86afVQOnK@serv.dtt360.com:8000')
    browser.open_browserscan()
    time.sleep(10)


open_browser()