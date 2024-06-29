class ProxyService : 
  
    def parse_proxy_string(self, proxy_str):
        proxy_str =  self.prepare_proxy_str(proxy_str)
        parts = proxy_str.split(':')
        proxy = {
            'host': parts[1][2:],  # Remove '//' from host
            'port': parts[2]
        }
        proxy_auth = {
            'username': parts[3],
            'password': parts[4].split('-')[0]  # Extract only the password part
        }
        proxy['additional'] = parts[4:]  # In case you need additional parameters

        return proxy_auth, proxy,proxy_auth

    
    def prepare_proxy_str(self,string):

        if 'http://' in string:
            return string
        return 'http://'+string