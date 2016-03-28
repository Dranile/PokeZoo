/*
 * Serveur de jeu -- Ordonnanceur --
 * Lancer avec la commande node serveur_jeu.js ou nodejs serveur_jeu.js
 * Routes disponibles :
 * 	- /game/joinGame
 *  - /game/getEtat
 *  - /game/updateGame
*/


var fs = require('fs');
var express = require('express');
var cors = require("cors");
var bodyParser = require('body-parser');
//var request = require('request');
var port = 5000;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
}));
app.use(cors());


//variable de jeu
var playersMax = 3;
var players = [];
var tabTimeout = [];
var timeoutTime = 10000; //soit 10000 ms
var plein = false;


function initPartie(){
	for(var i in players){
		console.log(players[i]);
	}	
}

function updatePlayers(joueur){
	for(var i in players){
		if(players[i]["pseudo"] == joueur["pseudo"]){
			players[i] = joueur;
			console.log(i);
			clearTimeout(tabTimeout[i]);
			//Problème au moment de l'activation du timeout ...
			//la fonction prend l'environnement courant ou lieu du moment où setTimeout est appelé
			tabTimeout[i] = setTimeout(function() {
				console.log( i + " " + players[i]["pseudo"] + " timed out");
				players.splice(i,1);
			}, timeoutTime);
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
			console.log(json);
			players.push({
				"pseudo":json
			});
			console.log("joueur ajouté");
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
	res.json(players);
});
app.listen(port);
console.log("Serveur tourne sur http://localhost:"+port);