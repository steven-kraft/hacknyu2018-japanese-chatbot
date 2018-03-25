var botui = new BotUI('japan-bot', {
  vue: Vue // or this
});

var botname = "JapanBot";

var kanaData = [];
var reviews = [];
var lessons = [];
var newUser = localStorage.getItem('newUser');
var group = localStorage.getItem('group');

var times = [4,8,24,48,168,336,728,2912]; // in hours

function hasData() {
  return localStorage.getItem('user');
}

function clearData() {localStorage.clear();}

function initKanaData() {
  //Initialize Kana Data Structure in Local Storage
  kana.forEach(function(k){
      kanaData.push({
          kana: k,
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
        user = res.value;
    });
}

function incrementGroup(){
  group = parseInt(localStorage.getItem('group')) + 1;
  localStorage.setItem('group', group);
}

function checkLessons(){
  var lastLesson = localStorage.getItem('lastLesson');
  if(newUser || !lastLesson){return true;}
  if(new Date().getHours() - lastLesson.getHours() > 0) {return true;}
  else {return false;}
}

function checkReviews(){
  var kanaData = localStorage.getItem('kanaData');
  reviews = [];
  kanaData.forEach(function(k){
      if (k.next_review.getHours() < Date().getHours()){
        reviews.push(k.kana);
      }
  })
  return reviews.length;
}

function lessonIntro(){
  return botui.message.add({
    delay: 1000,
    content: "Let's learn hiragana!"
  }).then(function(){
    return botui.message.add({
      delay: 1000,
      content: "During these lessons, you will be first shown a Hiragana \
      character and how it is written."
    })
  }).then(function(){
      return botui.message.add({
        delay: 1000,
        content: "You can listen to how it's pronounced, too."
      })
  }).then(function(){
      return botui.message.add({
        delay: 1000,
        content: "After you've learned a few kana, you'll be given the \
        opportunity to review everything."
      })
  }).then(function(){return startLessons()})
}

function startLessons(){
  //TODO Start lessons starting at specific group
  lessons = kanaGroups[group];
  return botui.message.add({
    delay: 1000,
    content: "Now, we'll begin by learning " + lessons.join(", ")
  }).then(function(){
    localStorage.setItem('lastLesson', new Date());
    localStorage.setItem('newUser', false);
    return displayLessons();
  });
}

function displayLessons(){
  if (lessons.length == 0) {return botui.action.hide({});}
  return botui.message.add({
    delay: 1000,
    cssClass: 'kana',
    content: lessons[0]
  }).then(function(){
    return botui.message.add({
      delay: 1500,
      content: "This hiragana is " + lessons[0] + ", which can be written '" + wanakana.toRomaji(lessons[0]) + "'."
    });
  }).then(function(){
    button_text = "Next"
    if (lessons.length == 1) {button_text = "Done"}
    return botui.action.button({
      delay: 1000,
      action: [{text: button_text, value: true}]
    })
  }).then(function(res){
    if(res.text == "Done") {
      incrementGroup();
    }
    lessons.shift();
    return displayLessons();
  });
}

function startReviews(){
  //TODO Start reviewing available reviews
}

function init(){
  if (hasData()){
    user = JSON.parse(localStorage.getItem('user')).value;
    return botui.action.hide({});
  }
  else {
    return showIntro().then(function(){
      initKanaData();
      localStorage.setItem('newUser', true);
      newUser = true;
      localStorage.setItem('group', 0);
      group = 0;
    });
  }
}

function main(){
  return botui.action.text({
    delay: 1000,
    action: {placeholder: "Enter a Command... (Type Help if You're Stuck)"}
    }).then(function (res) {
      //TODO Handle Commands Here
      for(var key in dict) {
          var regex = new RegExp(key, "gi"); //turns back to regex
          var tested = regex.test(res.value)
          if(tested){ //matched a regex
            if(dict[key] == translate){// goes into translate(eng or Jap)
              var tester = res.value.match(/([\u3040-\u30FF]+)/gi);
              console.log(res.value)
              console.log(tester)
              console.log(tester[0])
              translate(tester[0])
            }
          }
        }
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
}).then(function(){
  if(checkLessons()){
    if(localStorage.getItem('group')){return lessonIntro();}
    else {return startLessons();}
  }
  else{return main();}
});
