import random
from fake_useragent import UserAgent
from random_user_agent.user_agent import UserAgent as RandomUserAgent
from random_user_agent.params import SoftwareName, OperatingSystem
class UserAgentOption:

    def __init__(self) -> None:
        self.successor = None

    def set_successor(self,successor):

        self.successor = successor

    def run(self,options,user_agent , proxy_str, arguments):
        if not user_agent:
            user_agent = self.get_random_user_agent()
         
        options.add_argument(f'user-agent={user_agent}')
        return self.successor.run(options,user_agent , proxy_str, arguments)    
    
    def set_container(self,container):
        self.container = container

    def get_random_user_agent(self):
        # Initialize both user agents
        random_user_agent = RandomUserAgent(software_names=[SoftwareName.CHROME.value], operating_systems=[OperatingSystem.WINDOWS.value])
        fake_user_agent = UserAgent()

        # Get a random user agent from each
        random_user_agent_value = random_user_agent.get_random_user_agent()
        fake_user_agent_value = fake_user_agent.random

        # Combine or select one randomly
        combined_user_agent = random.choice([random_user_agent_value, fake_user_agent_value, fake_user_agent_value])

        
        return fake_user_agent_value