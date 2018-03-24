var botui = new BotUI('japan-bot', {
  vue: Vue // or this
});

function hasData() {
  return localStorage.getItem('user');
}

function clearData() {localStorage.clear();}

function showIntro(){
  //TODO Introduce user to the chatbot
}

function getUser() {
  // Get Name from User and store in LocalStorage
  if (hasData()){
    return JSON.parse(localStorage.getItem('user')).value;
  } else {
    botui.message.add({
      human: true,
      content: 'Whats your name?'
    }).then(function () {
      return botui.action.text({
        action: {
          placeholder: 'Your name'
        }
      });
    }).then(function (res) {
      localStorage.setItem('user', JSON.stringify(res));
      return res.value;
    });
  }
}

var user = getUser();
botui.message.add({content: 'Hello ' + user + '!'});
