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

// Load config
let buttonConfig = {};
fetch('button_config.json')
  .then(response => response.json())
  .then(data => {
    buttonConfig = data;
    console.log('Button config loaded:', buttonConfig);
  })
  .catch(error => console.error('Error loading button config:', error));

window.addEventListener('df-messenger-loaded', () => {
  console.log('Dialogflow Messenger loaded.');
  const dfMessenger = getDfMessenger();
  if (!dfMessenger) return;

  // 1. Set Context
  dfMessenger.setContext(testMetadata);
  console.log(`Metadata set for user ID: ${testMetadata.user_id}`);

  // 2. Attach Listener to All Trigger Buttons
  const triggerBtns = document.querySelectorAll('.chat-trigger-btn');
  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // Resolve query from Config ID or fallback to data-query
      const btnId = e.target.getAttribute('data-btn-id');
      let query = e.target.getAttribute('data-query'); // Legacy support

      if (btnId && buttonConfig.buttons && buttonConfig.buttons[btnId]) {
        query = buttonConfig.buttons[btnId].query;
      }

      query = query || 'Hi'; // Final fallback

      console.log(`Trigger Button Clicked. ID: ${btnId}, Query: "${query}"`);
      pendingTestEvent = true; // Set flag

      if (!isChatOpen) {
        console.log('Chat is closed. Opening via openChat()...');
        const chatBubble = dfMessenger.querySelector('df-messenger-chat-bubble');
        if (chatBubble) {
          chatBubble.openChat();
          console.log('Sending query immediately after openChat...');
          dfMessenger.renderCustomText(query, false);
          dfMessenger.sendRequest('query', query);
          pendingTestEvent = false; // Prevent listener from double-sending
          isNewSession = false; // Prevent Welcome event from firing
        } else {
          console.warn('df-messenger-chat-bubble not found. Falling back to expand attribute.');
          dfMessenger.setAttribute('expand', 'true');
        }
      } else {
        console.log('Chat already open. Sending query.');
        dfMessenger.renderCustomText(query, false);
        dfMessenger.sendRequest('query', query);
        pendingTestEvent = false;
        isNewSession = false;
      }
    });
  });
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
