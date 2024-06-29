class ExperimentalOptions:


    def __init__(self) -> None:
        self.successor = None
        self.container = None

    def set_successor(self,successor):

        self.successor = successor

    def run(self,options,user_agent , proxy_str, arguments):
        options.add_experimental_option("excludeSwitches", ["enable-automation"]) 
        options.add_argument("--disable-blink-features=AutomationControlled") 
        options.add_experimental_option("useAutomationExtension", False) 
        preferences = {
        "webrtc.ip_handling_policy" : "disable_non_proxied_udp",
        "webrtc.multiple_routes_enabled": False,
        "webrtc.nonproxied_udp_enabled" : False
        } 
        options.add_experimental_option("prefs", preferences)
        options.add_experimental_option("detach", True)
        return self.successor.run(options,user_agent , proxy_str, arguments)

    def set_container(self,container):
        self.container = container

