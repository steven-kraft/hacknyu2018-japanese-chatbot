var botui = new BotUI('japan-bot', {
  vue: Vue // or this
});

var botname = "JapanBot";

var kanaData = {};
if(localStorage.getItem('kanaData')){
  kanaData = JSON.parse(localStorage.getItem('kanaData'));
}

var reviews = [];
var lessons = [];
var newUser = localStorage.getItem('newUser');
var group = localStorage.getItem('group');
var skip = false;
var delay_time = 1500;

var correct = 0;
var incorrect = 0;

var times = [0,4,8,24,48,168,336,728,2912]; // in hours

function hasData() {
  return localStorage.getItem('user');
}

function clearData() {localStorage.clear();}

function initKanaData() {
  //Initialize Kana Data Structure in Local Storage
  kana.forEach(function(k){
      kanaData[k] = {level: 0, next_review: null}
  })
  localStorage.setItem('kanaData', JSON.stringify(kanaData));
}

function kanaCorrect(cur_kana) {
  kanaData[cur_kana].level += 1;
  correct += 1;
  var h = times [kanaData[cur_kana].level - 1]
  var time = new Date()
  time.setHours(time.getHours() + h)
  kanaData[cur_kana].next_review = time;
  localStorage.setItem('kanaData', JSON.stringify(kanaData));
  return botui.message.add({
    delay: 500,
    content: "Correct!!!"
  });
}

function kanaIncorrect(cur_kana) {
  kanaData[cur_kana].level = 2;
  incorrect += 1;
  var h = times [kanaData[cur_kana].level - 1]
  var time = new Date()
  time.setHours(time.getHours() + h)
  kanaData[cur_kana].next_review = time;
  localStorage.setItem('kanaData', JSON.stringify(kanaData));
  return botui.message.add({
    delay: 500,
    content: "Wrong!!!"
  });
}

function reviewResults(){
  return botui.message.add({
    delay: delay_time,
    content: "Review Complete! You got " + (correct - incorrect) + " correct and " + incorrect + " wrong."
  }).then(function(){return main();});
}

function showIntro(){
  return botui.message.add({
    content: "Hello! I'm " + botname + ". I'm glad you chose this resource to \
      help you learn to read Japanese."
  }).then(function () {
      return botui.message.add({
        content: 'Are you familiar with hiragana and katakana?',
        delay: delay_time
      })
    }).then(function(){
      return botui.action.button({
        delay: delay_time,
        action: [{text: 'Yes', value: true}, {text: 'No', value: false}]
      })
    }).then(function (res) {
        if(!res.value) {
          return botui.message.add({
            delay: delay_time,
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
            delay: delay_time,
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
  if(newUser == "true" || !lastLesson){return true;}
  if(checkReviews() > 0) {return false;}
  if(new Date().getHours() - new Date(lastLesson).getHours() > 0) {return true;}
  else {return false;}
}

function checkReviews(){
  var kanaData = JSON.parse(localStorage.getItem('kanaData'));
  reviews = [];
  Object.keys(kanaData).forEach(function(k) {
      if (kanaData[k].next_review != null) {
        if (new Date(kanaData[k].next_review) < new Date()){
          reviews.push(k);
        }
      }
  })
  return reviews.length;
}

function lessonIntro(){
  return botui.message.add({
    delay: delay_time,
    content: "Let's learn hiragana!"
  }).then(function(){
    return botui.message.add({
      delay: delay_time,
      content: "During these lessons, you will be first shown a Hiragana \
      character and how it is written."
    })
  }).then(function(){
      return botui.message.add({
        delay: delay_time,
        content: "You can listen to how it's pronounced, too."
      })
  }).then(function(){
      return botui.message.add({
        delay: delay_time,
        content: "After you've learned a few kana, you'll be given the \
        opportunity to review everything."
      })
  }).then(function(){return startLessons()})
}

var tempLessons;

function startLessons(){
  lessons = kanaGroups[group].slice();
  tempLessons = lessons.slice();
  return botui.message.add({
    delay: delay_time,
    content: "Now, we'll begin by learning " + lessons.join(", ")
  }).then(function(){
    return botui.message.add({
      delay: delay_time,
      content: "Are you ready?"
    });
  }).then(function(){
    return botui.action.button({
      delay: delay_time,
      action: [{text: 'Yes', value: true}, {text: 'No', value: false}]
    })
  }).then(function(res){
    localStorage.setItem('newUser', false);
    if(!res.value) {skip = true; return main();}
    localStorage.setItem('lastLesson', new Date());
    return displayLessons();
  });
}

function displayLessons(){
  if (lessons.length == 0) {return main();}
  return botui.message.add({
    delay: delay_time,
    cssClass: 'kana',
    content: lessons[0]
  }).then(function(){
    return botui.message.add({
      delay: 1500,
      content: "This hiragana is " + lessons[0] + ", which can be written '" + wanakana.toRomaji(lessons[0]) + "'."
    });
  }).then(function(){
    var button_text = "Next"
    if (lessons.length == 1) {button_text = "Done"}
    return botui.action.button({
      delay: delay_time,
      action: [{text: button_text, value: true}]
    });
  }).then(function(res){
        if(res.text == "Done") {
      incrementGroup();
            localStorage.setItem('newUser', false);
      tempLessons.forEach(function(k){
          kanaData[k].next_review = new Date();
          kanaData[k].level = 1;
      })
      localStorage.setItem('kanaData', JSON.stringify(kanaData));
    }
    lessons.shift();
    return displayLessons();
  });
}

function startReviews(){
  correct = 0;
  incorrect = 0;
  return botui.message.add({
    delay: delay_time,
    content: "Let's review what you've learned!"
  }).then(function(){
    return botui.message.add({
      delay: delay_time,
      content: "You have " + checkReviews() + " reviews! Are you ready?"
    });
  }).then(function(){
    return botui.action.button({
      delay: delay_time,
      action: [{text: 'Yes', value: true}, {text: 'No', value: false}]
    })
  }).then(function(res){
    if(!res.value){skip = true; return main();}
    return displayReviews();
  });
}

function displayReviews(){
  if (reviews.length == 0) {return reviewResults();}
  var current = reviews[Math.floor(Math.random()*reviews.length)];
  return botui.message.add({
    delay: delay_time,
    cssClass: 'kana',
    content: current
  }).then(function(){
    return botui.action.text({
      delay: delay_time,
      action: {placeholder: 'Reading?'}
    });
  }).then(function(res){
      if(res.value.toLowerCase().trim() == wanakana.toRomaji(current)) {
        reviews = reviews.filter(c => c !== current);
        return kanaCorrect(current);
      } else {return kanaIncorrect(current);}
  }).then(function(){return displayReviews()})
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
  if(!skip){
    if (checkReviews() > 0) {return startReviews();}
    else if(checkLessons()) {return startLessons();}
  }
  return botui.action.text({
    delay: delay_time,
    action: {placeholder: "Enter a Command... (Type Help if You're Stuck)"}
    }).then(function (res) {
      //TODO Handle Commands Here
      for(var key in dict) {
          var regex = new RegExp(key, "gi"); //turns back to regex
          var tested = regex.test(res.value)
          if(tested){ //matched a regex
            if(dict[key] == translate){// goes into translate(eng or Jap)
              var tester = res.value.match(/([\u3040-\u30FF]+)/gi)
              if (tester == null){
                tester = res.value.match(/([a-z]+)/gi);
                console.log(tester[1])
                translate(tester[1], mycallback)
              }
              else{
                console.log('jAP');
                translate(tester[0], mycallback)
              }
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
    delay: delay_time
  });
}).then(function(){
  if(checkLessons()){
    if(parseInt(localStorage.getItem('group')) == 0){return lessonIntro();}
  }
  else{return main();}
});
