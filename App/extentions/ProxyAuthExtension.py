from Framework.Contructs.Extension import IExtension

class ProxyAuthExtension(IExtension):
    
    def __init__(self, container) -> None:
        self.container = container

    def create(self, proxy, proxy_auth):
        manifest_json = """
        {
            "version": "1.0.0",
            "manifest_version": 2,
            "name": "Chrome Proxy",
            "permissions": [
                "proxy",
                "tabs",
                "unlimitedStorage",
                "storage",
                "<all_urls>",
                "webRequest",
                "webRequestBlocking"
            ],
            "background": {
                "scripts": ["background.js"]
            },
            "minimum_chrome_version": "22.0.0"
        }
        """

        background_js = f"""
        var config = {{
            mode: "fixed_servers",
            rules: {{
                singleProxy: {{
                    scheme: "http",
                    host: "{proxy['host']}",
                    port: parseInt({proxy['port']})
                }},
                bypassList: ["localhost"]
            }}
        }};

        chrome.proxy.settings.set({{ value: config, scope: "regular" }}, function() {{}});

        function callbackFn(details) {{
            return {{
                authCredentials: {{
                    username: "{proxy_auth['username']}",
                    password: "{proxy_auth['password']}"
                }}
            }};
        }}

        chrome.webRequest.onAuthRequired.addListener(
            callbackFn,
            {{ urls: ["<all_urls>"] }},
            ['blocking']
        );

        """ 

        extensionService = self.container.get_extension_service()
        return extensionService.register('proxy_auth_extension', manifest_json, background_js)
