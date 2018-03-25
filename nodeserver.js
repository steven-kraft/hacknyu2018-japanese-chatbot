var http = require('http'),
      fs = require('fs'),
     url = require('url'),
 choices = ["hello world", "goodbye world"];

var server =http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;
    var params = url.parse(request.url);
    var variablename = (params.query.split("=")[1])
    if(path=="/findword"){
        console.log("request recieved");
        var request = require("request");
        request(`http://jisho.org/api/v1/search/words?keyword=${variablename}`,function(error,response2,body)
      	{
          var obj = JSON.parse(body)
          try{
            var jWord0 = obj.data[0].japanese[0].word
            var jRead0= obj.data[0].japanese[0].reading
            var eTrans0 = obj.data[0].senses[0].english_definitions

            var result = {jword : jWord0, jRead : jRead0, eTrans : eTrans0.join()};
            response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin":"*"});
            console.log(result)
            response.end(JSON.stringify(result));
            console.log("string sent");
          }
          catch(e){}
      	})

    }else{
        console.log("error")
    }
}).listen(8001);
console.log("server initialized");
