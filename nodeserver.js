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
          console.log(variablename)
          var obj = JSON.parse(body)
          var englishtrans = obj.data[0].senses[0].english_definitions
          var engstring = englishtrans.join()

          response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin":"*"});
          response.end(engstring);
          console.log("string sent");
      	})

    }else{
        console.log("shit")
    }
}).listen(8001);
console.log("server initialized");
