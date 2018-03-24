var botui = new BotUI('japan-bot', {
  vue: Vue // or this
});

botui.message.add({
  content: 'Hello! Are you ready to learn Japanese?! 😤'
});

botui.message.add({
  human: true,
  content: 'Howdy!'
});
