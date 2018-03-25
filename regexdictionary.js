var dict = {}
function translate(variable, callback){ //Goes to the node.js server
    var string = ''
    var xmlhttp = new XMLHttpRequest();
    console.log(variable)
    xmlhttp.open("GET",`http://localhost:8001/findword?content=${variable}`, true);
    xmlhttp.onreadystatechange=function(){
         if (xmlhttp.readyState==4 && xmlhttp.status==200){
           callback(xmlhttp.responseText)
        }
    }
  xmlhttp.send("");
  }
function mycallback(data){
  var obj = JSON.parse(data);
  return botui.message.add({
    content: "word: " + obj.jword + '   Reading: ' + obj.jRead + '  English: ' + obj.eTrans
  })
}


function b(){console.log("yo this works")}
function c(){console.log("yo this works")}

dict["^translate ([\u3040-\u30FF]+)$"] = translate; //Translate to English
dict["^translate ([a-z]+)$"] = translate; //Translate to Japanese

dict["^how do I write ([\u3040-\u30FF])[?]?$"] = b;
dict["^how do I write ([\u3040-\u30FF]) in english[?]?$"] = c;
