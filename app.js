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

//variable de jeu
var playersMax = 3;
var players = [];
var etatJoueurs = [];
var tabTimeout = [];
var retour = null;
var timeoutTime = 10000; //soit 10000 ms
var plein = false;


function initPartie(){
	for(var i in players){
		console.log(players[i]);
	}
	retour = players;
}

function updateTimeoutPlayer(index){
	clearTimeout(tabTimeout[index]);
	//Problème au moment de l'activation du timeout ...
	//la fonction prend l'environnement courant ou lieu du moment où setTimeout est appelé
	tabTimeout[index] = setTimeout(function() {
		console.log(players[index]["pseudo"] + " timed out");
		players.splice(index,1);
		tabTimeout.splice(index,1);
	}, timeoutTime);
}

function updateGame(){
	etatJoueurs = [];
}

function jeuAJour(){
	for(var i in players){
		if(!etatJoueurs[i]){
			return false;
		}
	}
	return true;
}


function updatePlayers(joueur){
	for(var i in players){
		if(players[i]["pseudo"] == joueur["pseudo"]){
			players[i] = joueur;
			updateTimeoutPlayer(i);
			etatJoueurs[i] = 1;
			console.log("Mise à jour joueur : " + joueur["pseudo"]);
		}
	}
}


app.post("/game/joinGame", function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');
	if(/*players.length == playersMax ||*/ plein){
		console.log("Partie pleine");
    	res.end("plein");	
	}
	else{
		for(var p in req.body){
			var json = req.body[p];
			players.push({
				"pseudo":json
			});
			console.log("Un joueur vient de se connecter :" + json);
		}
		if(players.length == playersMax){
			plein = true;
			console.log("lancement de la partie !!");
			initPartie();
		}
		res.end("bienvenue");
	}
});

app.get("/game/getEtat", function(req,res){
	res.setHeader('Content-Type', 'text/plain');
	if(players.length == playersMax){
		res.end("pret");
	}
	else{
		res.end(players.length + "/" + playersMax);
	}
});

app.post("/game/updateGame", function(req, res){
	res.setHeader('Access-Control-Allow-Origin', '*');
	var json = req.body;
	updatePlayers(json);
	if(jeuAJour()){
		console.log("Tous le monde a envoyé, mis à jour de la partie");
		updateGame();
		retour = players;
	}
	res.json(retour);
});


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