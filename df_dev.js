console.log('df_dev executing...');

const testMetadata = {
  'subscription plan': 'Business Premium Plus',
  'user_id': '12345',
  'user_type': 'admin'
};

let isNewSession = false;
let isChatOpen = false;
let pendingTestEvent = false; // NEW FLAG to track button clicks

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
      console.log('Test Button Clicked. Setting pending flag...');
      pendingTestEvent = true; // Mark that we want to fire the 'test' event
      
      // Check if chat is closed
      if (!isChatOpen) {
        console.log('Chat is closed. Forcing open via Shadow DOM...');
        const shadowRoot = dfMessenger.shadowRoot;
        const triggerBtn = shadowRoot.querySelector('#widgetIcon') || 
                           shadowRoot.querySelector('button#trigger');
        
        if (triggerBtn) {
          triggerBtn.click();
        } else {
          console.error('Could not find trigger button in Shadow DOM.');
        }
      } else {
        // Chat is already open, fire immediately
        console.log('Chat already open. Firing test event now.');
        dfMessenger.sendRequest('event', 'test');
        pendingTestEvent = false; // Reset flag
      }
    });
  }
});

// 3. Handle Chat Opening
window.addEventListener('df-chat-open-changed', (event) => {
  isChatOpen = !!event.detail.isOpen;
  console.log(`Chat state changed. Open: ${isChatOpen}`);

  if (isChatOpen) {
    const dfMessenger = getDfMessenger();
    if (!dfMessenger) return;

    // Wait 500ms for animation to finish
    setTimeout(() => {
      
      // SCENARIO A: User clicked the Test Button
      if (pendingTestEvent) {
        console.log('Found pending test flag. Sending "test" event...');
        dfMessenger.sendRequest('event', 'test');
        pendingTestEvent = false; // Reset flag
      } 
      
      // SCENARIO B: Normal User Click (First time only)
      else if (isNewSession) {
        console.log('Normal open detected. Sending "Welcome" event...');
        dfMessenger.sendRequest('event', 'Welcome'); // Your standard welcome
        isNewSession = false;
      }
      
    }, 500);
  }
});

window.addEventListener('df-session-id-set', (event) => {
  isNewSession = event.detail.isNew;
  console.log(`Session ID set. Is new: ${isNewSession}`);
});
