console.log('df_dev executing...');

const testMetadata = {
  'subscription plan': 'Business Premium Plus',
  'user_id': '12345',
  'user_type': 'admin'
};

let isNewSession = false;
let isChatOpen = false; // Track locally if chat is open

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

  // 2. [NEW] Attach Listener to the Test Button
  const testBtn = document.getElementById('test-event-btn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      console.log('Test Button Clicked...');
      
      // A. Check if chat is closed. If so, force it open.
      if (!isChatOpen) {
        console.log('Chat is closed. Attempting to open...');
        // Hack to open V1 messenger programmatically (Click the shadow DOM icon)
        const shadowIcon = dfMessenger.shadowRoot.querySelector('#widgetIcon');
        if (shadowIcon) {
          shadowIcon.click();
        }
      }

      // B. Send the Event
      // Allow a tiny delay (100ms) for the UI to open before sending the event
      setTimeout(() => {
        dfMessenger.sendRequest('event', 'Welcome'); // Or use 'CUSTOM_TEST_EVENT'
        console.log('Manual Event sent via Test Button.');
      }, 100);
    });
  }
});

// Track Open/Close state so the button knows whether to "Click" the icon or not
window.addEventListener('df-chat-open-changed', (event) => {
  isChatOpen = !!event.detail.isOpen;
  console.log(`Chat state changed. Open: ${isChatOpen}`);

  // Triggers the automatic welcome on first open (your original logic)
  if (isChatOpen && isNewSession) {
    const dfMessenger = getDfMessenger();
    if (dfMessenger) {
      dfMessenger.sendRequest('event', 'Welcome');
      console.log('Auto-Welcome event sent on first open.');
      isNewSession = false;
    }
  }
});

window.addEventListener('df-session-id-set', (event) => {
  isNewSession = event.detail.isNew;
  console.log(`Session ID set. Is new: ${isNewSession}`);
});
