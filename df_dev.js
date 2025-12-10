console.log('df_dev executing...');

const testMetadata = {
  'subscription plan': 'Business Premium Plus',
  'user_id': '12345',
  'user_type': 'admin'
};

let isNewSession = false;

function getDfMessenger() {
  const dfMessenger = document.querySelector('df-messenger');
  if (!dfMessenger) {
    console.error('CRITICAL: df-messenger element not found.');
    return null;
  }
  return dfMessenger;
}

window.addEventListener('df-messenger-loaded', () => {
  console.log('Dialogflow Messenger loaded.');
  const dfMessenger = getDfMessenger();
  if (!dfMessenger) return;

  // 1. Set Context
  dfMessenger.setContext(testMetadata);
  console.log(`Metadata set for user ID: ${testMetadata.user_id}`);

  // 2. [FIXED] Attach Feedback Listener DIRECTLY to the element, not window
  dfMessenger.addEventListener('df-user-feedback-sent', (event) => {
    console.log('FEEDBACK EVENT FIRED!', event.detail);

    // Get reaction and normalize to lowercase to be safe
    const reaction = (event.detail.reaction || '').toUpperCase();

    if (reaction === 'THUMBS_DOWN' || reaction === 'DISLIKE') {
      console.log('Negative feedback detected. Attempting to render card...');
      
      // Check if the render function exists before calling it
      if (typeof dfMessenger.renderCustomCard === 'function') {
        dfMessenger.renderCustomCard([
          {
            "type": "info",
            "title": "We're sorry to hear that.",
            "subtitle": "If you need help, please contact our support team.",
            "image": {
              "src": {
                "rawUrl": "https://perts.net/favicon.ico" 
              }
            },
            "actionLink": "https://perts.net/support"
          }
        ]);
        console.log('Support card rendered successfully.');
      } else {
        console.error('Error: renderCustomCard function is missing on this widget version.');
      }
    }
  });
});

window.addEventListener('df-chat-open-changed', (event) => {
  const isOpen = !!event.detail.isOpen;
  console.log(`Chat is ${isOpen ? 'open' : 'closed'}`);

  if (isOpen && isNewSession) {
    const dfMessenger = getDfMessenger();
    if (dfMessenger) {
      dfMessenger.sendRequest('event', 'Welcome'); // Ensure this matches your Intent Event Name!
      console.log('Welcome event sent.');
      isNewSession = false;
    }
  }
});

window.addEventListener('df-session-id-set', (event) => {
  isNewSession = event.detail.isNew;
  console.log(`Session ID set. Is new: ${isNewSession}`);
});
