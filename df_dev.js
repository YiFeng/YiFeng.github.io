console.log('df_dev executing...');

const testMetadata = {
  'subscription plan': 'Business Premium Plus',
  'user_id': '12345',
  'user_type': 'admin'
};

let isNewSession = false;
let isChatOpen = false;
let pendingTestEvent = false;

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

  // 2. Attach Listener to the Test Button
  const testBtn = document.getElementById('test-event-btn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      console.log('Test Button Clicked.');
      pendingTestEvent = true; // Set flag

      if (!isChatOpen) {
        console.log('Chat is closed. Opening via openChat()...');
        const chatBubble = dfMessenger.querySelector('df-messenger-chat-bubble');
        if (chatBubble) {
          chatBubble.openChat();
          console.log('Sending "test" event immediately after openChat...');
          dfMessenger.sendRequest('query', 'How do I reset my password?');
          pendingTestEvent = false; // Prevent listener from double-sending
          isNewSession = false; // Prevent Welcome event from firing
        } else {
          console.warn('df-messenger-chat-bubble not found. Falling back to expand attribute.');
          dfMessenger.setAttribute('expand', 'true');
        }
      } else {
        console.log('Chat already open. Firing test event.');
        dfMessenger.sendRequest('query', 'How do I reset my password?');
        pendingTestEvent = false;
        isNewSession = false;
      }
    });
  }
});

// 3. Handle Chat Opening Logic
window.addEventListener('df-chat-open-changed', (event) => {
  isChatOpen = !!event.detail.isOpen;
  console.log(`Chat state changed. Open: ${isChatOpen}`);

  if (isChatOpen) {
    const dfMessenger = getDfMessenger();
    if (!dfMessenger) return;

    // Wait 500ms for the animation to finish
    setTimeout(() => {

      // CASE A: Opened via Test Button
      console.log(`Checking pendingTestEvent in listener. Value: ${pendingTestEvent}`);
      if (pendingTestEvent) {
        console.log('Pending Test Event detected. Sending "test"...');
        dfMessenger.sendRequest('event', 'test');
        pendingTestEvent = false; // Reset flag
      }

      // CASE B: Opened manually by User (First time)
      else if (isNewSession) {
        console.log('Normal User Open. Sending "Welcome"...');
        dfMessenger.sendRequest('event', 'Welcome');
        isNewSession = false;
      }

    }, 500);
  }
});

window.addEventListener('df-session-id-set', (event) => {
  isNewSession = event.detail.isNew;
  console.log(`Session ID set. Is new: ${isNewSession}`);
});
