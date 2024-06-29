from abc import ABC, abstractmethod

class IExtension(ABC):

    @abstractmethod
    def create(self, *args, **kwargs):
        pass
