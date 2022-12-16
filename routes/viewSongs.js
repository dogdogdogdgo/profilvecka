let fs = require('fs').promises;
let mongoClient = require('mongodb').MongoClient;

exports.processRoute = async function(request, response){
    let dbconnection;
    try{
        dbconnection = await mongoClient.connect('mongodb://127.0.0.1:27017');
        let dbo = dbconnection.db('skum_tomte_nisse');
        let tmpURL = new URL('http://' + request.headers.host + request.url);
        let template;
        
        if (tmpURL.searchParams.has('songid')){
            
            template = await fs.readFile('./templates/viewsongs.html', {encoding: 'utf8'});
            let dbres = await dbo.collection('songs').findOne({ songname: tmpURL.searchParams.get('songid')});
             template = template.replace('{{Atags}}', await fs.readFile('./templates/viewAllSongsAtags.html'));
        
            if (dbres){
                template = template.replace('{{songs}}', await fs.readFile('./templates/songTemplate.html', {encoding: 'utf8'}));
                
                template = template.replaceAll('{{songname}}', dbres.songname);
                template = template.replace('{{artist}}', dbres.artist);
                template = template.replace('{{genre}}', dbres.genre);
                template = template.replace('{{back}}', await fs.readFile('./templates/buttonToViewSongs.html'));
                
                response.writeHead(200, {'Content-type' : 'text/html'});
                response.end(template);   
            }    
        } else {
                let songListTemplate = await fs.readFile('./templates/viewSongs.html', {encoding: 'utf8'});
                let songListItemTemplate = await fs.readFile('./templates/songTemplate.html', {encoding: 'utf8'});
                let dbres = await dbo.collection('songs').find({}).toArray();//mikael do bode funka
                
                songListTemplate = songListTemplate.replace('{{back}}', '');
                songListTemplate = songListTemplate.replace('{{Atags}}', await fs.readFile('./templates/viewAllSongsAtags.html'));
                
                let songList = '';
                for (let i = 0; i < dbres.length; i++){
                    let tempString = songListItemTemplate;
                    tempString = tempString.replaceAll('{{songname}}', dbres[i].songname);
                    tempString = tempString.replace('{{artist}}', dbres[i].artist);
                    tempString = tempString.replace('{{genre}}', dbres[i].genre);
                    songList += tempString;
                }
                
                songListTemplate = songListTemplate.replace('{{songs}}', songList);
                console.log(songListTemplate);
                response.writeHead(200, {'Content-Type' : 'text/html'});
                response.end(songListTemplate);
        }
            
        
        
        //template = await fs.readFile('./templates/viewSongs.html', {encoding: 'utf8'});
        //tempalte = template.replace({{songs}}, '')
        
        
        

                /*let dbres2 = await dbo.collection('songs').find({}).toArry();
                let templateBuilder = await fs.readFile('./templates/songTemplate.html', {encoding: 'utf8'});
                console.log(templateBuilder);
                let compleatTemplate;
                for (let i = 0; i < dbres2.length; i++){
                    templateBuilder = templateBilder.replace('{{songname}}', dbres2.songname);
                    templateBuilder = templateBilder.replace('{{artist}}', dbres2.artist);
                    templateBuilder = templateBilder.replace('{{genre}}', dbres2.genre);
                    console.log(templateBuilder);
                    compleatTemplate += templateBuilder;*/



         
    } catch(e) {
        console.log(e.message);
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('error!!!');
    } finally {
        
    }
    
    
}

