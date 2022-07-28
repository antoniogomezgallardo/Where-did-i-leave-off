
/*
This extension will need information from a persistent variable as soon as it's installed. Start by including a listening event for runtime.onInstalled in the background script. Inside the onInstalled listener, the extension will set a value using the storage API. This will allow multiple extension components to access that value and update it. Inside the extension's directory create a file named background.js and add the following code.

Most APIs, including the storage API, must be registered under the "permissions" field in the manifest for the extension to use them.
*/

let color = '#3aa757'; // This is the variable that holds the color to which the background is gonna change

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({color});
  console.log('Default background color set to %cgreen', `color: ${color}`);
});
