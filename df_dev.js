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

// 1. Listen for df-messenger-loaded to set initial context.
window.addEventListener('df-messenger-loaded', () => {
  console.log('Dialogflow Messenger loaded.');
  const dfMessenger = getDfMessenger();
  dfMessenger.setContext(testMetadata);
  console.log(`Metadata for user ID '${testMetadata.user_id}' sent to Dialogflow Messenger context.`);
});

// 2. Listen for df-chat-open-changed to capture the exact moment the chat opens.
window.addEventListener('df-chat-open-changed', (event) => {
  const isOpen = !!event.detail.isOpen;
  console.log(`Chat is ${isOpen ? 'open' : 'closed'}`);

  // Trigger the Welcome event only when the chat opens and it's a new session.
  if (isOpen && isNewSession) {
    const dfMessenger = getDfMessenger();
    dfMessenger.sendRequest('event', 'Welcome'); // Make sure this matches your event name (Case Sensitive)
    console.log('Welcome event sent to Dialogflow Messenger on first open of a new session.');
    
    // Reset the state to prevent the welcome message from being sent again
    // if the user closes and reopens the chat within the same session.
    isNewSession = false;
  }
});

// 3. Listen for df-session-id-set to determine if it's a new session.
window.addEventListener('df-session-id-set', (event) => {
  isNewSession = event.detail.isNew;
  console.log(`DF-Messenger session ID set. Is new session: ${isNewSession}`);
});

// 4. [NEW] Listen for User Feedback (Thumbs Down) to show Support Link
window.addEventListener('df-user-feedback-sent', (event) => {
  console.log('User feedback sent:', event.detail);

  // Check if the reaction is a Thumbs Down (Dislike)
  if (event.detail.reaction === 'THUMBS_DOWN') {
    const dfMessenger = getDfMessenger();
    
    // Render a custom card immediately in the chat to redirect user
    dfMessenger.renderCustomCard([
      {
        "type": "info",
        "title": "We're sorry to hear that.",
        "subtitle": "If you couldn't find what you needed, please contact our support team.",
        "image": {
          "src": {
            "rawUrl": "https://perts.net/favicon.ico" // Optional: Change to a relevant support icon URL
          }
        },
        "actionLink": "https://www.perts.net/contact"
      }
    ]);
    console.log('Negative feedback detected. Support link card rendered.');
  }
});
