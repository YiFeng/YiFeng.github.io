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

window.addEventListener('df-chat-open-changed', async (event) => {
  const isOpen = !!event.detail.isOpen;
  const hasSession = !!sessionStorage.getItem('df-messenger-sessionID');

  console.log(`Chat is ${isOpen ? 'open' : 'closed'}`);

  if (isOpen & !hasSession) {
    const dfMessenger = getDfMessenger();
    await dfMessenger.sendRequest('event', 'Welcome');
    console.log('Welcome event sent to Dialogflow Messenger.');
  }
});
