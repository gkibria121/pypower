// // Listener for tab creation
// chrome.tabs.onCreated.addListener(function(tab) {
//     updateTimezone(function() {
//       console.log('Timezone updated before loading the new tab.');
//       // Logic to proceed with tab loading can be added here if needed
//     });
//   });
  
//   // Listener for tab activation
//   chrome.tabs.onActivated.addListener(function(activeInfo) {
//     updateTimezone(function() {
//       console.log('Timezone updated on tab activation.');
//       // Logic to handle tab activation after time zone update
//     });
//   });
  
//   // Function to update timezone
//   function updateTimezone(callback) {
//     fetch('https://ipinfo.io/json')
//       .then(response => response.json())
//       .then(data => {
//         const timezone = data.timezone;
//         chrome.storage.local.set({ 'timezone': timezone }, function() {
//           console.log('Timezone is set to ' + timezone);
//           if (callback) callback();
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching IP info:', error);
//         if (callback) callback();  // Proceed even if there's an error
//       });
//   }
  