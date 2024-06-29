from abc import ABC, abstractmethod

class IOption(ABC):

    @abstractmethod
    def set_successor(self,successor):
        pass

    @abstractmethod
    def run(self,options,user_agent , proxy_str, arguments):
        pass

    @abstractmethod
    def set_container(self,container):
        pass

