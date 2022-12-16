 let fs = require('fs');
 
 exports.handleFileRequest = function(request, response, tmpURL){
     let splitPath = tmpURL.pathname.split('.');
     if (splitPath.length > 1){
         let fileType = splitPath.pop().toLowerCase();
         fs.readFile('public' + tmpURL.pathname, function(error, data){
            if (!error){
                switch (fileType){
                    case 'css':
                        response.writeHead(200, {'Content-Type' : 'text/css'});
                        break;
                    case 'jpg':
                        response.writeHead(200, {'Content-Type' : 'image/jpeg'});
                        break;
                    case 'png':
                        response.writeHead(200, {'Content-Type' : 'image/png'});
                        break;
                    case 'html':
                        response.writeHead(200, {'Content-Type' : 'text/html'});
                        break;
                }
                response.end(data);
            } 
            else{
                console.log('File not found...' + 'public' + tmpURL.pathname);
                response.writeHead(404, {'Content-Type' : 'text/plain'});
                response.end('Error 404 - Not found');
            }
         });
         return true;
     }
     return false;
 };
