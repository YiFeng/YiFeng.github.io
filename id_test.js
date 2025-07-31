const dfMessenger = document.querySelector('df-messenger');

const metadata = {
  "subscription plan": "Business Premium Plus",
  "user_id": "12345",
  "user_type": "admin"
};

// Function to set the context, so we can call it immediately or after the event
function setDfMessengerContext() {
  if (dfMessenger) {
    dfMessenger.setContext({
      name: 'user_metadata',
      parameters: metadata,
      lifespan: 1
    });
    console.log(`Metadata for user ID '${metadata.user_id}' sent to Dialogflow Messenger context.`);
  } else {
    // This case should ideally not happen if df-messenger is showing up
    console.log('df-messenger element not found when trying to set context.');
  }
}

// Check if df-messenger is already loaded
// The 'loaded' property is a common pattern for web components to indicate readiness
if (dfMessenger && dfMessenger.loaded) {
  setDfMessengerContext(); // If already loaded, set context immediately
} else if (dfMessenger) {
  // If not yet loaded, or if 'loaded' property isn't available, wait for the event
  dfMessenger.addEventListener('df-messenger-loaded', setDfMessengerContext);
} else {
  // Fallback if the df-messenger element itself isn't found
  console.error("DF-Messenger element not found on the page. Cannot attach event listener or set context.");
}