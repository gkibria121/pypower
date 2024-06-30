from Framework.Services.ExtensionService import ExtensionService
from App.Services.ProxyService import ProxyService
from App.extentions.ProxyAuthExtension import ProxyAuthExtension
from App.extentions.TimzeZoneExtension import TimeZoneExtension
from App.ProcessDriver.ProcessDriver import ProcessDriver
 
import zipfile
class Container:
    @staticmethod
    def get_extension_service():
        return ExtensionService(zipfile_module=zipfile)
    
    @staticmethod
    def get_proxy_service():
        return ProxyService()
 
    @staticmethod
    def get_proxy_auth_extension():
        return ProxyAuthExtension(Container())
    
 
 
    @staticmethod
    def get_driver_processor():
        return ProcessDriver()
    
 
    @staticmethod
    def get_time_zone_extension():
        return TimeZoneExtension(Container())