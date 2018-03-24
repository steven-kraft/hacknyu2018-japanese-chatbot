var botui = new BotUI('japan-bot', {
  vue: Vue // or this
});

function hasData() {
  return localStorage.getItem('user');
}

function clearData() {localStorage.clear();}

function showIntro(){

  //TODO Explain how the chat bot works
}

function getUser() {
  // Get Name from User and store in LocalStorage
  if (hasData()){
    user = JSON.parse(localStorage.getItem('user')).value;
    return botui.action.hide({});
  } else {
    return botui.message.add({
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
      user = res.value;
    });
  }
}

var user = "";
getUser().then(function(){
  botui.message.add({content: 'Hello ' + user + '!'});
});
