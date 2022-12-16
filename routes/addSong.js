let fs = require('fs').promises;
let mongoClient = require('mongodb').MongoClient;

async function get(request, response){
    try{
        let template = await fs.readFile('./templates/addSong.html', {encoding: 'utf8'});
        
        
        
        response.writeHead(200, {'Content-type' : 'text/html'});
        response.end(template);
    } catch(e) {
        console.log(e.message);
        response.writeHead(500, {'Content-Type' : 'text/plain'});
        response.end('Error 500 - internal server error');
    }
}

function post(request, response){
    let data ='';
    
    request.on('data', function(chunk){
        data += chunk;
    });
    
    let dbconn;
    request.on('end', async function(){
        try{
            let searchParams = new URLSearchParams(data);
            if (searchParams.has('artist') && searchParams.has('songName') && searchParams.has('genre')){
                dbconn = await mongoClient.connect('mongodb://127.0.0.1:27017');
                let dbo = dbconn.db('skum_tomte_nisse');
                
                let dataobj = {
                    artist: searchParams.get('artist'),
                    songname: searchParams.get('songName'),
                    genre: searchParams.get('genre')
                };
                
                await dbo.collection('songs').insertOne(dataobj);
                response.writeHead(303, {'Location': '/viewsongs?songid=' + dataobj.songname });
                response.end();
            } else {
                response.writeHead(422, {'Content-Type': 'text/plain'});
                response.end('Error - All field was not provided');
            }
        } catch(e) {
            console.log(e);
            response.writeHead(500, {'Content-Type' : 'text/plain'});
            response.end('Error 500 - not good!');
            
        } finally {
            dbconn && dbconn.close();
        }
    });
}

exports.processRoute = function(request, response){
    if (request.method === 'POST'){
        post(request, response);
    } else {
        get(request, response);
    }
};


