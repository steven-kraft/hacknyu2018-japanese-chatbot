var botui = new BotUI('japan-bot', {
  vue: Vue // or this
});

var botname = "JapanBot";

function hasData() {
  return localStorage.getItem('user');
}

function clearData() {localStorage.clear();}

function showIntro(){
  return botui.message.add({
    content: `Hello! I'm ${botname}. I'm glad you chose this resource to help you learn to read Japanese.`
  }).then(function () {
      return botui.message.add({
        content: 'Are you familiar with hiragana and katakana?',
        delay: 1000
      })
    }).then(function(){
      return botui.action.button({
        delay: 1000,
        action: [{text: 'Yes', value: true}, {text: 'No', value: false}]
      })
    }).then(function (res) {
        if(!res.value) {
          return botui.message.add({
            delay: 1000,
            content: "Hiragana and katakana, collectively called kana, are two of the three writing systems used in Japanese."
          }).then(function(){
            return botui.message.add({
              delay: 3000,
              content: "Hiragana and katakana are syllabaries which represent all of the possible sounds that can be expressed in the Japanese language."
            }).then(function(){
                return botui.message.add({
                  delay: 3000,
                  content: "There are 46 of each; each hiragana has a corresponding katakana, and they sound the same. Hiragana is used to write native Japanese words, and katakana is used to write foreign loanwords."
                  })
              })
          })
        }
      });
}

function getUser() {
  // Get Name from User and store in LocalStorage
  if (hasData()){
    user = JSON.parse(localStorage.getItem('user')).value;
    return botui.action.hide({});
  } else {
    return showIntro().then(function(){
      return botui.message.add({
        delay: 1000,
        content: "Great! One more thing, what's your name?"
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
    });
  }
}

var user = "";
getUser().then(function(){
  botui.message.add({content: 'Hello ' + user + '!'});
});
