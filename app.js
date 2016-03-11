var fs = require('fs');
var express = require('express');
var query = require("querystring");
var port = 5000;
var cors = require("cors");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
        extended: false,
     parameterLimit: 10000,
     limit: 1024 * 1024 * 10
}));
app.use(bodyParser.json({
        extended: false,
     parameterLimit: 10000,
     limit: 1024 * 1024 * 10
}));
app.use(cors());
// app.get("/", function(req,res){
// 	fs.readFile("index.html", function(err, text){
//       res.setHeader("Content-Type", "text/html");
//       res.end(text);
//     });
// });


app.get("/server/getType", function(req, res){
	res.setHeader('Content-Type', 'application/json');
	fs.readFile('cfg/type.json', 'utf8', function (err,data) {
		if (err) {
			res.json(null);
			return console.log(err);
		}
		data = JSON.parse(data);
	  	console.log(data);
	  	res.json(data);
		});
});


app.get("/server/setType", function(req, res){
		
});

app.get("/server/getMap", function(req, res){
	res.setHeader('Content-Type', 'application/json');
	fs.readFile('cfg/map.json', 'utf8', function (err,data) {
		if (err) {
			res.json("null");
			return console.log(err);
		}
		data = JSON.parse(data);
	  	res.json(data);
	  	console.log("fichier de map envoyé");
		});
});

app.post("/server/setMap", function(req, res){

    var map;
    for(var p in req.body){
        map = JSON.parse(req.body[p]);
    }
    fs.writeFile("cfg/map.json", JSON.stringify(map), function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("Fichier de map sauvegardé");
	}); 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end("Données bien reçues !");
});
app.listen(port);
console.log("Serveur tourne sur http://localhost:"+port);

//Utilisation de socket.io pour le jeu, pour l'interface admin je fais de l'AJAX pour le moment
//https://openclassrooms.com/courses/des-applications-ultra-rapides-avec-node-js/socket-io-passez-au-temps-reel
//http://mherman.org/blog/2013/10/20/handling-ajax-calls-with-node-dot-js-and-express-scraping-craigslist/#.VtdODFn9LIU