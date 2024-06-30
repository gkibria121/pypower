class ProxyOption:

    def __init__(self) -> None:
        self.successor = None

    def set_successor(self,successor):

        self.successor = successor

    def run(self,options,user_agent , proxy_str, arguments):
        if not proxy_str:
            return self.successor.run(options,user_agent , proxy_str, arguments)
            

        proxy_auth, proxy, proxy_auth = self.get_proxy(proxy_str)
        proxy_url = f"{proxy['host']}:{proxy['port']}"
        options.add_argument(f'--proxy-server={proxy_url}')
        if  not proxy_auth:
            return self.successor.run(options,user_agent , proxy_str, arguments)

        extension_path = self.create_proxy_auth_extension(proxy,proxy_auth)    
        options.add_extension(extension_path)

        return self.successor.run(options,user_agent , proxy_str, arguments)
    
    def get_proxy(self,proxy_str):
        proxy_service = self.container.get_proxy_service()

        proxy_string = proxy_service.prepare_proxy_str(proxy_str)
        return  proxy_service.parse_proxy_string( proxy_string)

    def create_proxy_auth_extension(self,proxy,proxy_auth):
        proxy_auth_extension =  self.container.get_proxy_auth_extension()
        return proxy_auth_extension.create( proxy, proxy_auth)
    
    def set_container(self,container):
        self.container = container

