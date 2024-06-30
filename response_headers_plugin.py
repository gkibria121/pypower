import proxy
from typing import Optional 
from proxy.http.proxy import HttpProxyBasePlugin
from proxy.http.parser import HttpParser 

class FsProxyPlugin(HttpProxyBasePlugin):
    def before_upstream_connection(
            self, request: HttpParser,
    ) -> Optional[HttpParser]:
        print(request.headers)
        return request

if __name__ == "__main__":
    with proxy.Proxy(
        input_args=[
            "--threaded",
            "--enable-reverse-proxy"
        ],
        enable_web_server=True,
        port=8080,
        plugins=[FsProxyPlugin]
    ) as _:
        proxy.sleep_loop()