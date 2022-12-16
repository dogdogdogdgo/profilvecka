let fs = require('fs').promises;
let mongoClient = require('mongodb').MongoClient;

exports.processRoute = async function(request, response){
    try {
        let template = await fs.readFile('./templates/index.html', {encoding:'utf8'});
        
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.end(template);
    } catch(e) {
        
    } finally {
        
    }
}