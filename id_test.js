console.log("id_test.js: Script started."); // CONFIRM SCRIPT RUNS

document.addEventListener('DOMContentLoaded', () => {
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
    setDfMessengerContext()
  } else {
    console.error("id_test.js: ERROR: df-messenger element not found on the page at script start."); // CONFIRM THIS ERROR PATH
  }

  console.log("id_test.js: Script finished setup."); // CONFIRM SCRIPT COMPLETES SETUP
});

