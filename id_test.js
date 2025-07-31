const dfMessenger = document.querySelector('df-messenger');

dfMessenger.addEventListener('df-messenger-loaded', function () {
  const userId = "12345";
  if (userId) {
    dfMessenger.setContext({
      name: 'user_info',
      parameters: {
        user_id: userId
      },
      lifespan: 1
    });
    console.log(`User ID '${userId}' sent to Dialogflow Messenger context.`);
  } else {
    console.log('User ID not found or not logged in.');
  }
});