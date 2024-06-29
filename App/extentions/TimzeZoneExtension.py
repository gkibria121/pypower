from Framework.Contructs.Extension import IExtension

class TimeZoneExtension(IExtension):
    
    def __init__(self, container) -> None:
        self.container = container

    def create(self):
        manifest_json = """
{
  "manifest_version": 3,
  "name": "IP Timezone Extension",
  "version": "1.0",
  "description": "Fetches and displays timezone information based on IP address.",
  "permissions": [
    "scripting",
    "activeTab",
    "storage"
  ],
  "host_permissions": [
    "http://worldtimeapi.org/*",
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  }
}
        """

        background_js = """
chrome.runtime.onInstalled.addListener(function() {
    fetchAndDisplayTimezone();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fetchTimezone") {
        fetchAndDisplayTimezone();
        sendResponse({status: "Fetching timezone..."});
    } else if (request.action === "getTimezone") {
        chrome.storage.local.get(['currentTimezone'], function(result) {
            sendResponse({timezone: result.currentTimezone || 'Not set'});
        });
        return true;  // Indicates that the response is sent asynchronously
    }
    return true;
});

function fetchAndDisplayTimezone() {
    fetch('http://worldtimeapi.org/api/ip')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const timezone = data.timezone;
            chrome.storage.local.set({currentTimezone: timezone}, function() {
                console.log('Timezone saved:', timezone);
                notifyTimezoneChange(timezone);
            });
        })
        .catch(error => {
            console.error('Error fetching timezone:', error);
            // Fallback to a default timezone if fetch fails
            const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            chrome.storage.local.set({currentTimezone: defaultTimezone}, function() {
                console.log('Default timezone saved:', defaultTimezone);
                notifyTimezoneChange(defaultTimezone);
            });
        });
}

function notifyTimezoneChange(timezone) {
    chrome.runtime.sendMessage({action: "timezoneUpdated", timezone: timezone});
}

// Remove the changeTimezone and setTimezone functions as we're no longer modifying active tabs directly
        """

        popup_html = """ 
<!DOCTYPE html>
<html>
<head>
    <title>IP Timezone Extension</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        button {
            margin-top: 10px;
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h4>Current Timezone: </h4>
    <div id="timezone"></div>
    <button id="fetchTimezoneButton">Fetch Timezone</button>
    <button id="changeTimezoneButton">Change Timezone</button>
    <script src="popup.js"></script>
</body>
</html>


        """

        popup_js = """ 
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fetchTimezoneButton').addEventListener('click', fetchIPandDisplayTimezone);
    document.getElementById('changeTimezoneButton').addEventListener('click', fetchIPandDisplayTimezone);
    
    // Display the current timezone when popup opens
    displayCurrentTimezone();
});

function fetchIPandDisplayTimezone() {
    chrome.runtime.sendMessage({action: "fetchTimezone"}, function(response) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log(response.status);
        }
    });
}

function displayCurrentTimezone() {
    chrome.runtime.sendMessage({action: "getTimezone"}, function(response) {
        document.getElementById('timezone').textContent = response.timezone;
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "timezoneUpdated") {
        document.getElementById('timezone').textContent = request.timezone;
    }
});
   """

        extensionService = self.container.get_extension_service()
        return extensionService.register('time_zone_change_extension', manifest_json, background_js, files=[
            {
                'name': 'popup.js',
                'content': popup_js
            },
            {
                'name': 'popup.html',
                'content': popup_html
            }
        ])
