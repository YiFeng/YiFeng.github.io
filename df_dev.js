const testMetadata = {
  "subscription plan": "Business Premium Plus",
  "user_id": "12345",
  "user_type": "admin"
};

async function initializeDialogflow(metadata) {
  const dfMessenger = document.querySelector('df-messenger');
  if (!dfMessenger) {
    throw new Error('df-messenger element not found on the page.');
  }
  dfMessenger.setContext(metadata);
  console.log(`Metadata for user ID '${metadata.user_id}' sent to Dialogflow Messenger context.`);

  await dfMessenger.sendRequest('event', 'Welcome');
  console.log('Welcome event sent to Dialogflow Messenger.');
}

document.addEventListener('df-messenger-loaded', () => {
  initializeDialogflow(testMetadata);
});

