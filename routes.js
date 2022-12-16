let addSong = require('./routes/addSong.js');
let viewSongs = require('./routes/viewSongs.js');
let viewGoodSongs = require('./routes/viewGoodSongs.js');
let index = require('./routes/index.js');

exports.processRoute = function(request, response, route){
    if (route.length === 0){
        index.processRoute(request, response);
    }
    else{
        let stage = route.shift();
        if (stage === 'addsong'){
            addSong.processRoute(request, response);
        }
        else if (stage === 'viewsongs'){
            viewSongs.processRoute(request, response);
        }
        else if (stage === 'viewgoodsongs'){
            viewGoodSongs.processRoute(request, response);
        }
        else{
            response.writeHead(404, {'Content-Type' : 'text/plain'});
            response.end('Error 404 - not found');
        }
    }
}

