
from App.Services.OptionService import OptionService
from Framework.Container import Container
class ChromeOptions:
    def __init__(self,options,user_agent=None, proxy_str=None, arguments=[]) -> None:
        self.options = options
        self.user_agent = user_agent
        self.proxy_str = proxy_str
        self.arguments = arguments
        self.option_service = OptionService(Container)
    def create_options(self):

        return self.option_service.generate_options(self.options,self.user_agent , self.proxy_str, self.arguments)
 
 



        