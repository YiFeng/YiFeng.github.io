const dfMessenger = document.querySelector('df-messenger');

const metadata = {
  "subscription plan": "Business Premium Plus",
  "user_id": "12345",
  "user_type": "admin"
};

dfMessenger.addEventListener('df-messenger-loaded', function () {
  if (dfMessenger) {
      dfMessenger.setContext({
          name: 'user_metadata',
          parameters: metadata,
          lifespan: 1 
      });
      console.log(`Metadata for user ID '${metadata.user_id}' sent to Dialogflow Messenger context.`);
  } else {
      console.log('df-messenger element not found on the page.');
  }
});