class TimeZoneOption:

    def __init__(self) -> None:
        self.successor = None

    def set_successor(self,successor):

        self.successor = successor

    def run(self,options,user_agent , proxy_str, arguments):
        extension_path = self.create_ip_time_zone_update()

        options.add_extension(extension_path)
 

        return self.successor.run(options,user_agent , proxy_str, arguments)

    
    def set_container(self,container):
        self.container = container
    
    def create_ip_time_zone_update(self):
        self.time_zone_extension = self.container.get_time_zone_extension()
        return self.time_zone_extension.create()
        

