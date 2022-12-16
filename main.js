let http = require('http');
let URL = require('url').URL;
let routes = require('./routes.js');
let fileServer = require('./fileServer.js');

function processRoute(request, response){
    let tmpURL = new URL('http://' + request.headers.host + request.url);
    
    let route = tmpURL.pathname.split('/').filter(x => x);
    console.log(route.length);
    
    if(!fileServer.handleFileRequest(request, response, tmpURL)){
        routes.processRoute(request, response, route);
    }
    
}

let httpServer = http.createServer(processRoute);
httpServer.listen(8080);


