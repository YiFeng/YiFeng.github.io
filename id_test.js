console.log("id_test.js: Script started."); // CONFIRM SCRIPT RUNS

const dfMessenger = document.querySelector('df-messenger');

const metadata = {
  "subscription plan": "Business Premium Plus",
  "user_id": "12345",
  "user_type": "admin"
};

// Function to set the context
function setDfMessengerContext() {
  console.log("id_test.js: setDfMessengerContext function called."); // CONFIRM FUNCTION IS CALLED
  if (dfMessenger) {
    dfMessenger.setContext({
      name: 'user_metadata',
      parameters: metadata,
      lifespan: 1
    });
    console.log(`id_test.js: Metadata for user ID '${metadata.user_id}' sent to Dialogflow Messenger context.`); // YOUR TARGET LOG
  } else {
    console.error('id_test.js: ERROR: df-messenger element was null inside setDfMessengerContext.');
  }
}

// Initial check for dfMessenger existence
if (dfMessenger) {
  console.log("id_test.js: df-messenger element found."); // CONFIRM ELEMENT IS FOUND
  // Check if df-messenger is already loaded (this property might not always be reliable)
  if (dfMessenger.loaded) { // df-messenger.loaded might be undefined or false initially
    console.log("id_test.js: df-messenger is already marked as loaded."); // CONFIRM THIS PATH
    setDfMessengerContext(); // If already loaded, set context immediately
  } else {
    console.log("id_test.js: df-messenger not yet loaded or 'loaded' property is false/undefined. Adding event listener."); // CONFIRM THIS PATH
    // If not yet loaded, wait for the event
    dfMessenger.addEventListener('df-messenger-loaded', setDfMessengerContext);
  }
} else {
  console.error("id_test.js: ERROR: df-messenger element not found on the page at script start."); // CONFIRM THIS ERROR PATH
}

console.log("id_test.js: Script finished setup."); // CONFIRM SCRIPT COMPLETES SETUP