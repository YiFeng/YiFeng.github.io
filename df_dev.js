console.log('df_dev executing...')

const testMetadata = {
  'subscription plan': 'Business Premium Plus',
  'user_id': '12345',
  'user_type': 'admin'
};

function getDfMessenger() {
  const dfMessenger = document.querySelector('df-messenger');
  if (!dfMessenger) {
    throw new Error('df-messenger element not found on the page.');
  }
  return dfMessenger;
}

window.addEventListener('df-messenger-loaded', () => {
  console.log('Dialogflow Messenger loaded.');
  const dfMessenger = getDfMessenger();
  dfMessenger.setContext(testMetadata);
  console.log(`Metadata for user ID '${testMetadata.user_id}' sent to Dialogflow Messenger context.`);
});

window.addEventListener('df-chat-open-changed', (event) => {
  const isOpen = !!event.detail.isOpen;
  console.log(`Chat is ${isOpen ? 'open' : 'closed'}`);

window.addEventListener('df-session-id-set', async (event) => {
  const isNewSession = event.detail.isNew;
  console.log(`DF-Messenger session ID set. Is new session: ${isNew}`);

  if (isOpen && isNewSession) {
    dfMessenger.sendRequest('event', 'Welcome');
    console.log('Welcome event sent to Dialogflow Messenger on new session.');
  }
});
