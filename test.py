import asyncio
import nodriver as uc
import time

PROXY = "serv.dtt360.com:8000"
USERNAME = "Skhan"
PASSWORD = "qGsg86afVQOnK-country-US-session-7Xx9B3Pb"

class Scraper:
    main_tab: uc.Tab

    def __init__(self):
        uc.loop().run_until_complete(self.run())

    async def run(self):
        browser = await uc.start(
            browser_args=[
                f"--proxy-server={PROXY}",
                "--disable-webrtc",
                "--webrtc.ip_handling_policy=disable_non_proxied_udp",
                "--webrtc.multiple_routes_enabled=false",
                "--webrtc.nonproxied_udp_enabled=false",
                # Additional flags to disable proxy detection
                "--disable-extensions",
                "--disable-gpu",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--disable-remote-fonts",
                "--disable-client-side-phishing-detection",
                "--disable-ipc-flooding-protection",
                "--disable-popup-blocking",
                "--disable-prompt-on-repost",
                "--ignore-certificate-errors",
                "--no-default-browser-check",
                "--disable-infobars",
                "--disable-breakpad",
                "--disable-cast",
                "--disable-cast-streaming-hw-encoding",
                "--disable-cloud-import",
                "--disable-default-apps",
                "--disable-extensions-file-access-check",
                "--disable-notifications",
                "--disable-password-generation",
                "--disable-print-preview",
                "--disable-speech-api",
                "--disable-voice-input",
                "--disable-wake-on-wifi",
                "--hide-scrollbars",
                "--metrics-recording-only",
                "--mute-audio",
                "--no-pings",
                "--password-store=basic",
                "--use-mock-keychain",
                "--disable-blink-features=AutomationControlled",
            ],
        )
        self.main_tab = await browser.get("draft:,")
        self.main_tab.add_handler(uc.cdp.fetch.RequestPaused, self.req_paused)
        self.main_tab.add_handler(
            uc.cdp.fetch.AuthRequired, self.auth_challenge_handler
        )
        await self.main_tab.send(uc.cdp.fetch.enable(handle_auth_requests=True))
        
        # Additional steps to evade detection
        await self.set_webdriver(self.main_tab)
        
        page = await browser.get("https://www.browserscan.net")
        await asyncio.sleep(6000)

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

if __name__ == "__main__":
    Scraper()