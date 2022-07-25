Getting started

Published on Friday, February 28, 2014 • Updated on Monday, April 25, 2022

Extensions are made of different, but cohesive, components. Components can include background scripts, content scripts, an options page, UI elements and various logic files. Extension components are created with web development technologies: HTML, CSS, and JavaScript. An extension's components will depend on its functionality and may not require every option.

This tutorial will build an extension that allows the user to change the background color of the currently focused page. It will use many of the extension platform's components to give an introductory demonstration of their relationships.

To start, create a new directory to hold the extension's files.

The completed extension can be downloaded here.
#
Create the manifest

Extensions start with their manifest. Create a file called manifest.json and include the following code.

{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3
}

#
Load an unpacked extension

The directory holding the manifest file can be added as an extension in developer mode in its current state. To load an unpacked extension in developer mode, follow these steps:

    Open the Extension Management page by navigating to chrome://extensions.
        Alternatively, open this page by clicking on the Extensions menu button and selecting Manage Extensions at the bottom of the menu.
        Alternatively, open this page by clicking on the Chrome menu, hovering over More Tools then selecting Extensions
    Enable Developer Mode by clicking the toggle switch next to Developer mode.
    Click the Load unpacked button and select the extension directory.

Loading an unpacked extension

Ta-da! The extension has been successfully installed. Because no icons were included in the manifest, a generic icon will be created for the extension.
#
Add functionality

The extension is now installed, but it doesn't currently do anything because we haven't told it what to do or when to do it. Let's fix that by adding some code to store a background color value.
#
Register the background script in the manifest

Background scripts, like many other important components, must be registered in the manifest. Registering a background script in the manifest tells the extension which file to reference, and how that file should behave.

{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  }
}

Chrome is now aware that the extension includes a service worker. When you reload the extension, Chrome will scan the specified file for additional instructions, such as important events it needs to listen for.
#
Create the background script

This extension will need information from a persistent variable as soon as it's installed. Start by including a listening event for runtime.onInstalled in the background script. Inside the onInstalled listener, the extension will set a value using the storage API. This will allow multiple extension components to access that value and update it. Inside the extension's directory create a file named background.js and add the following code.

// background.js

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

#
Add the storage permission

Most APIs, including the storage API, must be registered under the "permissions" field in the manifest for the extension to use them.

{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage"]
}

#
Inspect the background script

Navigate back to the extension management page and click the Reload link. A new field, Inspect views, becomes available with a blue link, service worker.
Inspect views

Click the link to view the background script's console log, "Default background color set to green"
#
Introduce a user interface

Extensions can have many forms of a user interface; this one will use a popup. Create and add a file named popup.html to the extension's directory. This extension uses a button to change the background color.

<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="button.css">
  </head>
  <body>
    <button id="changeColor"></button>
  </body>
</html>

Like the background script, this file must be declared in the manifest in order for Chrome to present it in the extension's popup. To do this, add an action object to the manifest and set popup.html as the action's default_popup.

{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage"],
  "action": {
    "default_popup": "popup.html"
  }
}

This popup's HTML references an external CSS file named button.css. Add another file to the extension's directory, name it appropriately, and add the following code.

button {
  height: 30px;
  width: 30px;
  outline: none;
  margin: 10px;
  border: none;
  border-radius: 2px;
}

button.current {
  box-shadow: 0 0 0 2px white,
              0 0 0 4px black;
}

Designation for toolbar icons is also included under action in the default_icon field. Download the images folder here, unzip it, and place it in the extension's directory. Update the manifest so the extension knows how to use the images.

{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "/images/get_started16.png",
      "32": "/images/get_started32.png",
      "48": "/images/get_started48.png",
      "128": "/images/get_started128.png"
    }
  }
}

Extensions also display images on the extension management page, the permissions warning, and favicon. These images are designated in the manifest under icons.

{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "/images/get_started16.png",
      "32": "/images/get_started32.png",
      "48": "/images/get_started48.png",
      "128": "/images/get_started128.png"
    }
  },
  "icons": {
    "16": "/images/get_started16.png",
    "32": "/images/get_started32.png",
    "48": "/images/get_started48.png",
    "128": "/images/get_started128.png"
  }
}

By default, extensions appear in the extensions menu (the puzzle piece). Pinning the extension will display the icon in the toolbar.
Pin the extension to the toolbar

If the extension is reloaded at this stage, it will include the provided icon rather than the default placeholder, and clicking the action will open a popup that displays a button showing the default color.
Popup

The last step for the popup UI is adding color to the button. Create and add a file named popup.js with the following code to the extension's directory.

// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

This code grabs the button from popup.html and requests the color value from storage. It then applies the color as the background of the button. Include a script tag to popup.js in popup.html.

<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="button.css">
  </head>
  <body>
    <button id="changeColor"></button>
    <script src="popup.js"></script>
  </body>
</html>

Reload the extension to view the green button.
#
Layer logic

The extension now has a custom icon and a popup, and it colors the popup button based on a value saved to the extension's storage. Next, it needs logic for further user interaction. Update popup.js by adding the following to the end of the file.

// When the button is clicked, inject setPageBackgroundColor into current page
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

The updated code adds a click event listener to the button, which triggers a programmatically injected content script. This turns the background color of the page the same color as the button. Using programmatic injection allows for user-invoked content scripts, instead of auto inserting unwanted code into web pages.

The manifest will need the activeTab permission to allow the extension temporary access to the current page, and the scripting permission to use the Scripting API's executeScript method.

{
  "name": "Getting Started Example",
  ...
  "permissions": ["storage", "activeTab", "scripting"],
  ...
}

The extension is now fully functional! Reload the extension, refresh this page, open the popup and click the button to turn it green! However, some users may want to change the background to a different color.
Gotchas

Extensions can not inject content scripts on internal Chrome pages like "chrome://extensions". Be sure to try out the extension on a real webpage like https://google.com.
#
Give users options

The extension currently only allows users to change the background to green. Including an options page gives users more control over the extension's functionality, further customizing their browsing experience.

Start by creating a file in the directory named options.html and include the following code.

<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="button.css">
  </head>
  <body>
    <div id="buttonDiv">
    </div>
    <div>
      <p>Choose a different background color!</p>
    </div>
    <script src="options.js"></script>
  </body>
</html>

Then register the options page in the manifest,

{
  "name": "Getting Started Example",
  ...
  "options_page": "options.html"
}

Reload the extension and right-click the extension icon in the toolbar then select Options. Alternatively, click DETAILS and scroll down the details page and select Extension options.
Right click to open the options page

The last step is to add the options logic. Create a file named options.js in the extension's directory with the following code.

let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// Reacts to a button click by marking the selected button and saving
// the selection
function handleButtonClick(event) {
  // Remove styling from the previously selected color
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
}

// Add a button to the page for each supplied color
function constructOptions(buttonColors) {
  chrome.storage.sync.get("color", (data) => {
    let currentColor = data.color;
    // For each color we were provided…
    for (let buttonColor of buttonColors) {
      // …create a button with that color…
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;

      // …mark the currently selected color…
      if (buttonColor === currentColor) {
        button.classList.add(selectedClassName);
      }

      // …and register a listener for when that button is clicked
      button.addEventListener("click", handleButtonClick);
      page.appendChild(button);
    }
  });
}

// Initialize the page by constructing the color options
constructOptions(presetButtonColors);

Four color options are provided then generated as buttons on the options page with onclick event listeners. When the user clicks a button, it updates the color value in the extension's storage. Since all of the extension's files pull the color information from this storage, no other values need to be updated.
#
Take the next step

Congratulations! The directory now holds a fully-functional, albeit simplistic, Chrome extension.

What's next?

    The Chrome Extension Overview backs up a bit, and fills in a lot of detail about the Extensions architecture in general, and some specific concepts developers will want to be familiar with.
    Learn about the options available for debugging Extensions in the debugging tutorial.
    Chrome Extensions have access to powerful APIs above and beyond what's available on the open web. The chrome.* APIs documentation will walk through each API.
    The developer's guide has dozens of additional links to pieces of documentation relevant to advanced extension creation.

Last updated: Monday, April 25, 2022 Improve article
