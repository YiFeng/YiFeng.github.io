console.log('df_dev executing...')

const testMetadata = {
  'subscription plan': 'Business Premium Plus',
  'user_id': '12345',
  'user_type': 'admin'
};

// A global variable to hold the 'isNew' state of the session.
let isNewSession = false;

// Helper function to get the df-messenger element.
function getDfMessenger() {
  const dfMessenger = document.querySelector('df-messenger');
  if (!dfMessenger) {
    throw new Error('df-messenger element not found on the page.');
  }
  return dfMessenger;
}

// Listen for df-messenger-loaded event to set initial context.
window.addEventListener('df-messenger-loaded', () => {
  console.log('Dialogflow Messenger loaded.');
  const dfMessenger = getDfMessenger();
  dfMessenger.setContext(testMetadata);
  console.log(`Metadata for user ID '${testMetadata.user_id}' sent to Dialogflow Messenger context.`);
});

// Listen for df-chat-open-changed to capture the exact moment the chat opens.
window.addEventListener('df-chat-open-changed', (event) => {
  const isOpen = !!event.detail.isOpen;
  console.log(`Chat is ${isOpen ? 'open' : 'closed'}`);

  // Trigger the Welcome event only when the chat opens and it's a new session.
  if (isOpen && isNewSession) {
    const dfMessenger = getDfMessenger();
    dfMessenger.sendRequest('event', 'Welcome');
    console.log('Welcome event sent to Dialogflow Messenger on first open of a new session.');
    
    // Reset the state to prevent the welcome message from being sent again
    // if the user closes and reopens the chat within the same session.
    isNewSession = false;
  }
});

// Listen for df-session-id-set to determine if it's a new session.
window.addEventListener('df-session-id-set', (event) => {
  isNewSession = event.detail.isNew;
  console.log(`DF-Messenger session ID set. Is new session: ${isNewSession}`);
});
