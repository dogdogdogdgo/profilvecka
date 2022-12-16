let fs = require('fs').promises;
let mongoClient = require('mongodb').MongoClient;

exports.processRoute = async function(request, response){
    let dbconnection;
    try {       
        dbconnection = await mongoClient.connect('mongodb://127.0.0.1:27017');
        let dbo = dbconnection.db('skum_tomte_nisse');
        let tmpURL = new URL('http://' + request.headers.host + request.url);
        
        let songListTemplate = await fs.readFile('./templates/viewSongs.html', {encoding: 'utf8'});
        let songListItemTemplate = await fs.readFile('./templates/songTemplate.html', {encoding: 'utf8'});
        let dbres = await dbo.collection('songs').find({}).toArray();//mikael: "dä bode funka"

        songListTemplate = songListTemplate.replace('{{back}}', '');
        songListTemplate = songListTemplate.replace('{{Atags}}', await fs.readFile('./templates/viewGoodSongsAtags.html'));

        let songList = '';
        for (let i = 0; i < dbres.length; i++){
            if (dbres[i].genre === 'metal'){
                let tempString = songListItemTemplate;
                tempString = tempString.replaceAll('{{songname}}', dbres[i].songname);
                tempString = tempString.replace('{{artist}}', dbres[i].artist);
                tempString = tempString.replace('{{genre}}', dbres[i].genre);
                songList += tempString;
            }
        }
        //console.log(songList);
        songListTemplate = songListTemplate.replace('{{songs}}', songList);

        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.end(songListTemplate);
        /*let template = await fs.readFile('./templates/viewSongs.html', {encoding: 'utf8'});
        

        let songListItemTemplate = await fs.readFile('./templates/songTemplate.html', {encoding: 'utf8'});
        let dbres = await dbo.collection('songs').find({}).toArray();//mikael do bode funka

        songListTemplate = songListTemplate.replace('{{back}}', '');
       

        let songList = '';
        for (let i = 0; i < dbres.length; i++){
            if(dbres[i] === 'metal'){
                let tempString = songListItemTemplate;
               tempString = tempString.replaceAll('{{songname}}', dbres[i].songname);
               tempString = tempString.replace('{{artist}}', dbres[i].artist);
               tempString = tempString.replace('{{genre}}', dbres[i].genre);
               songList += tempString;   
            }
        }
        console.log(songList);
        songListTemplate = songListTemplate.replace('{{songs}}', songList);

        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.end(songListTemplate);

        
        
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.end(template);*/
    } catch(e) {
        console.log(e.message);
        
    } finally {
        
    }
}



