console.log('df_dev executing...');

const testMetadata = {
  'subscription plan': 'Business Premium Plus',
  'user_id': '12345',
  'user_type': 'admin'
};

let isNewSession = false;
let isChatOpen = false;

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

  // 2. [FIXED] Attach Listener to the Test Button
  const testBtn = document.getElementById('test-event-btn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      console.log('Test Button Clicked...');
      
      // A. Check if chat is closed. If so, force it open using the OFFICIAL API.
      if (!isChatOpen) {
        console.log('Chat is closed. Attempting to open...');
        
        // Select the BUBBLE element, not the main messenger
        const bubble = document.querySelector('df-messenger-chat-bubble');
        
        if (bubble && typeof bubble.openChat === 'function') {
          bubble.openChat(); // This is the correct API command
        } else {
          console.error('Could not find df-messenger-chat-bubble or openChat method.');
        }
      } else {
        // If it's already open, we just fire the event manually
        console.log('Chat is already open. Firing event directly.');
        dfMessenger.sendRequest('event', 'Welcome');
      }
      
      // Note: We don't need to fire the event manually in the "A" block because
      // opening the chat triggers 'df-chat-open-changed', which handles the welcome event below.
    });
  }
});

// Track Open/Close state and Fire Auto-Welcome
window.addEventListener('df-chat-open-changed', (event) => {
  isChatOpen = !!event.detail.isOpen;
  console.log(`Chat state changed. Open: ${isChatOpen}`);

  if (isChatOpen && isNewSession) {
    const dfMessenger = getDfMessenger();
    if (dfMessenger) {
      // Use a small timeout to ensure the UI is ready to render the message
      setTimeout(() => {
        dfMessenger.sendRequest('event', 'Welcome');
        console.log('Auto-Welcome event sent on first open.');
        isNewSession = false;
      }, 500);
    }
  }
});

window.addEventListener('df-session-id-set', (event) => {
  isNewSession = event.detail.isNew;
  console.log(`Session ID set. Is new: ${isNewSession}`);
});
