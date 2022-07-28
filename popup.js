// Initialize button with user's preferred color

let changeColor = document.getElementById("changeColor");

// This code grabs the button from popup.html and requests the color value from storage. It then applies the color as the background of the button. Just the button, not the background of the page.
chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color; 
});

/*
When the button is clicked, inject setPageBackgroundColor into current page

The updated code adds a click event listener to the button, which triggers a programmatically injected content script. This turns the background color of the page the same color as the button. Using programmatic injection allows for user-invoked content scripts, instead of auto inserting unwanted code into web pages.

The manifest will need the activeTab permission to allow the extension temporary access to the current page, and the scripting permission to use the Scripting API's executeScript method.
*/

changeColor.addEventListener("click", async () => {

let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
