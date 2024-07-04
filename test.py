import asyncio
import nodriver as uc
import time
 
PROXY = "serv.dtt360.com:8000"
USERNAME = "Skhan"
PASSWORD = "qGsg86afVQOnK"

class Scraper:
    main_tab: uc.Tab

    def __init__(self):
        uc.loop().run_until_complete(self.run())

    async def run(self):
        browser = await uc.start(
            browser_args=[
                f"--proxy-server={PROXY}",
                "--disable-webrtc",
                # "--disable-blink-features=AutomationControlled",
                "--disable-rtc-smoothness-algorithm",
                "--disable-rtc-probes",
                "--webrtc-ip-handling-policy=disable_non_proxied_udp",
                "--webrtc-multiple-routes-enabled=false",
                "--webrtc-nonproxied-udp-enabled=false",
                "--user-data-dir=Profiles/"
            ],
        )
        self.main_tab = await browser.get("draft:,")
        self.main_tab.add_handler(uc.cdp.fetch.RequestPaused, self.req_paused)
        self.main_tab.add_handler(
            uc.cdp.fetch.AuthRequired, self.auth_challenge_handler
        )
       
         
         
        await self.main_tab.send(uc.cdp.fetch.enable(handle_auth_requests=True))
        
        # Additional steps to evade detection and disable WebRTC
        await self.set_webdriver(self.main_tab)
        await self.disable_webrtc(self.main_tab)

        
        page =await  browser.get("https://chatgpt.com/chat")
        # await self.updateTimeZone(self.main_tab)

        await asyncio.sleep(100)
    async def auth_challenge_handler(self, event: uc.cdp.fetch.AuthRequired):
        asyncio.create_task(
            self.main_tab.send(
                uc.cdp.fetch.continue_with_auth(
                    request_id=event.request_id,
                    auth_challenge_response=uc.cdp.fetch.AuthChallengeResponse(
                        response="ProvideCredentials",
                        username=USERNAME,
                        password=PASSWORD,
                    ),
                )
            )
        )

    async def req_paused(self, event: uc.cdp.fetch.RequestPaused):
        asyncio.create_task(
            self.main_tab.send(
                uc.cdp.fetch.continue_request(request_id=event.request_id)
            )
        )

    async def set_webdriver(self, tab):
        await tab.send(
            uc.cdp.page.add_script_to_evaluate_on_new_document(
                source="""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                })
                """
            )
        )
        

    async def disable_webrtc(self, tab):
        await tab.send(
            uc.cdp.page.add_script_to_evaluate_on_new_document(
                source="""
                function disableWebRTC() {
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        navigator.mediaDevices.getUserMedia = () => new Promise((resolve, reject) => {
                            reject(new Error("getUserMedia is disabled"));
                        });
                    }
                    if (navigator.getUserMedia) {
                        navigator.getUserMedia = () => new Promise((resolve, reject) => {
                            reject(new Error("getUserMedia is disabled"));
                        });
                    }
                    if (window.RTCPeerConnection) {
                        window.RTCPeerConnection = () => {
                            throw new Error("RTCPeerConnection is disabled");
                        };
                    }
                    if (navigator.webkitGetUserMedia) {
                        navigator.webkitGetUserMedia = () => new Promise((resolve, reject) => {
                            reject(new Error("webkitGetUserMedia is disabled"));
                        });
                    }
                }
                disableWebRTC();
            };
                 
                """
            )
        )
    
    async def updateTimeZone(self, tab):
        await tab.send(uc.cdp.emulation.set_timezone_override({'timezoneId': 'America/New_York'}))
        
        
        

if __name__ == "__main__":
    Scraper()