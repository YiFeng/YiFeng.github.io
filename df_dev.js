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

async function initializeDialogflow(metadata) {
  const dfMessenger = getDfMessenger();
  dfMessenger.setContext(metadata);
  console.log(`Metadata for user ID '${metadata.user_id}' sent to Dialogflow Messenger context.`);

  await dfMessenger.sendRequest('event', 'Welcome');
  console.log('Welcome event sent to Dialogflow Messenger.');
}

window.addEventListener('df-messenger-loaded', () => {
  console.log('Dialogflow Messenger loaded.');
  initializeDialogflow(testMetadata);
});

window.addEventListener('df-chat-open-changed', async (event) => {
  const isOpen = !!event.detail.isOpen;

  console.log(`Chat is ${isOpen ? 'open' : 'closed'}`);

  if (isOpen) {
    const dfMessenger = getDfMessenger();
    await dfMessenger.sendRequest('event', 'Welcome');
    console.log('Welcome event sent to Dialogflow Messenger.');
  }
});
