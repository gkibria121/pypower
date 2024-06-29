from Framework.Services.ExtensionService import ExtensionService
from App.Services.ProxyService import ProxyService
from App.ChromeOptions.Options.ProxyOption import ProxyOption
from App.ChromeOptions.Options.UserAgentOption import UserAgentOption
from App.ChromeOptions.Options.ExperimentalOptions import ExperimentalOptions
from App.ChromeOptions.Options.WebRTC import WebRTC
from App.ChromeOptions.Options.TimeZoneOption import TimeZoneOption
from App.ChromeOptions.Options.Default import Default
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
    def get_proxy_option():
        return ProxyOption()
    
    @staticmethod
    def get_user_agent_option():
        return UserAgentOption()
    
    @staticmethod
    def get_default_options():
        return Default()
    
    @staticmethod
    def get_proxy_auth_extension():
        return ProxyAuthExtension(Container())
    
    @staticmethod
    def get_experimental_options():
        return ExperimentalOptions()

 
    @staticmethod
    def get_driver_processor():
        return ProcessDriver()
    
 
    @staticmethod
    def get_webrtc_options():
        return TimeZoneOption()
    
    @staticmethod
    def get_time_zone_option():
        return WebRTC( )
    
    @staticmethod
    def get_time_zone_extension():
        return TimeZoneExtension(Container())