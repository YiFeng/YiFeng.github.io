console.log("id_test.js: Script started."); // CONFIRM SCRIPT RUNS

document.addEventListener('DOMContentLoaded', () => {
  const dfMessenger = document.querySelector('df-messenger');
  dfMessenger.sendEvent('Welcome');

  const metadata = {
    "subscription plan": "Business Premium Plus",
    "user_id": "12345",
    "user_type": "admin"
  };

  // Function to set the context
  function setDfMessengerContext() {
    if (dfMessenger) {
      dfMessenger.setContext({
        name: 'user_metadata',
        parameters: metadata,
        lifespan: 1
      });
      console.log(`Metadata for user ID '${metadata.user_id}' sent to Dialogflow Messenger context.`); // YOUR TARGET LOG
    } else {
      console.error('ERROR: df-messenger element was null inside setDfMessengerContext.');
    }
  }

  // Initial check for dfMessenger existence
  if (dfMessenger) {
    setDfMessengerContext()
  } else {
    console.error("ERROR: df-messenger element not found on the page at script start.");
  }
});

