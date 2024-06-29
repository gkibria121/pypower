class WebRTC:

    def __init__(self) -> None:
        self.successor = None

    def set_successor(self,successor):

        self.successor = successor

    def run(self,options,user_agent , proxy_str, arguments):

        options.add_argument("--disable-webrtc")
        options.add_argument("--disable-rtc-smoothness-algorithm")
        options.add_argument("--disable-rtc-probes")

        return self.successor.run(options,user_agent , proxy_str, arguments)
    
 
    
    def set_container(self,container):
        self.container = container

