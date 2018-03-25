var dict = {}
function translate(variable){ //Goes to the node.js server
   xmlhttp = new XMLHttpRequest();
   xmlhttp.open("GET",`http://localhost:8001/findword?content=${variable}`, true);
   xmlhttp.onreadystatechange=function(){
         if (xmlhttp.readyState==4 && xmlhttp.status==200){
           string=xmlhttp.responseText;
           console.log(string);
         }
   }
   xmlhttp.send("");
}
function b(){console.log("yo this works")}
function c(){console.log("yo this works")}

dict["^translate ([\u3040-\u30FF]+)$"] = translate; //Translate to English
dict["^translate ([a-z]+)$"] = translate; //Translate to Japanese

dict["^how do I write ([\u3040-\u30FF])[?]?$"] = b;
dict["^how do I write ([\u3040-\u30FF]) in english[?]?$"] = c;
