class OptionService:


    def __init__(self,container) -> None:
        self.proxy = container.get_proxy_option()
        self.user_agent = container.get_user_agent_option()
        self.default = container.get_default_options()
        self.experimental_options = container.get_experimental_options()
        self.webrtc = container.get_webrtc_options()
        self.time_zoone = container.get_time_zone_option()
 

        self.user_agent.set_successor(self.proxy)
        self.proxy.set_successor(self.experimental_options)
        self.proxy.set_successor(self.webrtc)
        self.webrtc.set_successor(self.experimental_options)
        self.experimental_options.set_successor(self.default)

        self.user_agent.set_container(container)
        self.proxy.set_container(container) 
        self.webrtc.set_container(container) 
 

    def generate_options(self,options,user_agent , proxy_str, arguments):

        return self.user_agent.run(options,user_agent , proxy_str, arguments)