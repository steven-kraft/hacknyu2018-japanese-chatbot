var botui = new BotUI('japan-bot', {
  vue: Vue // or this
});

var botname = "JapanBot";

var hiragana = [
		"あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ",
    "た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ",
    "ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を",
    "ん","が","ぎ","ぐ","げ","ご","ざ","じ","ず","ぜ","ぞ","だ","ぢ","づ","で",
    "ど","ば","び","ぶ","べ","ぼ","ぱ","ぴ","ぷ","ぺ","ぽ"
]

var kanaData = [];

function hasData() {
  return localStorage.getItem('user');
}

function clearData() {localStorage.clear();}

function initKanaData() {
  //TODO Initialize Kana Data Structure in Local Storage
  hiragana.forEach(function(h){
      kanaData.push({
          kana: h,
          level: 0,
          next_review: null
        })
  })
  localStorage.setItem('kanaData', JSON.stringify(kanaData));
}

function kanaCorrect(kana) {
  //TODO Update kana based on correct answer
}

function kanaIncorrect(kana) {
  //TODO Update kana based on incorrect answer (reset time)
}

function showIntro(){
  return botui.message.add({
    content: "Hello! I'm " + botname + ". I'm glad you chose this resource to \
      help you learn to read Japanese."
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
            content: "Hiragana and katakana, collectively called kana, are two\
              of the three writing systems used in Japanese."
          }).then(function(){
            return botui.message.add({
              delay: 3000,
              content: "Hiragana and katakana are syllabaries which represent \
                all of the possible sounds that can be expressed in the \
                Japanese language."
            }).then(function(){
                return botui.message.add({
                  delay: 3000,
                  content: "There are 46 of each; each hiragana has a \
                    corresponding katakana, and they sound the same. Hiragana \
                    is used to write native Japanese words, and katakana is \
                    used to write foreign loanwords."
                  })
              })
          })
        }
      }).then(function(){
          return botui.message.add({
            delay: 1000,
            content: "Great! One more thing, what's your name?"
          })
        }).then(function() {
          return getUser();
        });
}

function getUser() {
  // Get Name from User and store in LocalStorage
  return botui.action.text({
        action: {placeholder: 'Your name'}
      }).then(function (res) {
        localStorage.setItem('user', JSON.stringify(res));
        initKanaData();
        user = res.value;
    });
}

function checkReviews(){
  //TODO Check for and inform user of upcoming reviews
}

function startLessons(group){
  //TODO Start lessons starting at specific group
}

function startReviews(){
  //TODO Start reviewing available reviews
}

function init(){
  if (hasData()){
    user = JSON.parse(localStorage.getItem('user')).value;
    return botui.action.hide({});
  }
  else {return showIntro();}
}

function main(){
  return botui.action.text({
    delay: 1000,
    action: {placeholder: "Enter a Command... (Type Help if You're Stuck)"}
    }).then(function (res) {
      //TODO Handle Commands Here
      console.log("User Entered: ", res.value);
      return botui.action.hide({});
    }).then(function(){return main();})
}

var user = "";
init().then(function(){
  return botui.message.add({
    content: 'Hello ' + user + '!',
    delay: 1000
  });
}).then(function(){return main();});
