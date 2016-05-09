var fs = require('fs');
var express = require('express');
var query = require("querystring");
var port = 5000;
var cors = require("cors");
var app = express();
var bodyParser = require('body-parser');
var game = require("./server/game.js");
var personnage = require("./server/animal.js");

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
var renvoi = []
var timeoutTime = 10000; //soit 10000 ms
var plein = false;
var animaux;

var carte = [];
var carteClient = [];


function initialiseAnimaux(){
	var lion = personnage.Animal('lion', "viande");
	var loup = personnage.Animal('loup', "viande");
	var guepard = personnage.Animal('guepard', "viande");
	var ours = personnage.Animal('ours', "poisson");
	animaux = [lion,loup,guepard, ours];
	console.log(animaux);
}

function changeObjet(objet){
    /* 
     * Permet de changer un objet possédant des méthodes dans prototype en objet sans méthode (utile pour les reqêtes AJAX)
    */
    var obj = {};
    for(var i in objet){
        if(objet.hasOwnProperty(i)){
            obj[i] = objet[i];
        }
    }
    return obj;
}

function initialiserCarte(){

	if(carteClient.length == 0 && carte.length == 0){
		fs.readFile('cfg/map.json', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			carte = JSON.parse(data);
			for(var i in carte){
				carteClient.push({"type":carte[i]["type"],
					        "color":carte[i]["color"]});
			}
		});
		console.log("carte initialisée");
	}
}

function updateTimeoutPlayer(index){
	clearTimeout(tabTimeout[index]);
	//Problème au moment de l'activation du timeout ...
	//la fonction prend l'environnement courant ou lieu du moment où setTimeout est appelé
	tabTimeout[index] = setTimeout(function() {
		console.log(players[index]["nom"] + " timed out");
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
		if(players[i]["nom"] == joueur["nom"]){
			players[i].update(joueur);
			updateTimeoutPlayer(i);
			etatJoueurs[i] = 1;
			console.log("Mise à jour joueur : " + joueur["nom"]);
		}
	}
}

app.post("/game/nourrir", function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');

	//------------------------ Methode 2 --------------------------------------------------------------------
	console.log(req.body);

	for(var i in animaux){
		if(req.body["nomAnimal"] == animaux[i]["nom"]){
			var indiceAnimal = i;
		}
	}

	for(var i in players){
		if(req.body["nomJoueur"] == players[i]["nom"]){
			var indiceJoueur = i;
		}
	}

	players = players[indiceJoueur].nourrir(animaux[indiceAnimal], players);

	//------------------------ Methode 1 : problème, le tableau de niveau marche mal... --------------------
	/*for(var i in req.body){
		var bete = req.body[i];	
	}
	console.log(bete);
	bete = JSON.parse(bete);
	//var bete = JSON.parse(req.body);//le parsing se passe mal :( et si on parse pas, on perd le tableau de niveau
	for(var i in animaux){
		if(animaux[i]["nom"] == bete["nom"]){
			animaux[i].update(bete);
		}
	}*/
	res.end("OK");
});


app.post("/game/joinGame", function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');
	if(/*players.length == playersMax ||*/ plein){
		console.log("Partie pleine");
    	res.end("plein");	
	}
	else{
		var json = req.body;
		console.log(json);
		var joueur = personnage.Joueur(json["nom"],json["image"]);
		joueur.update(json);
		players.push(joueur);
		console.log("Un joueur vient de se connecter :" + json["nom"]);

		if(players.length == playersMax){
			plein = true;
			initialiseAnimaux();
			game.initPartie(players,animaux, function(j,a){
				players = j;
				animaux = a;
				retour = players;
				console.log(players);
				console.log("lancement de la partie !!");	
			});
		}
		res.end("bienvenue");
	}
});

app.get("/game/getEtat", function(req,res){
	//res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Access-Control-Allow-Origin', '*');
	if(plein){
		//res.end("pret");
		res.json(retour);
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
		animaux = personnage.chasseAnimaux(players,animaux,carte);
		renvoi = [];
		renvoi.push(players);
		renvoi.push(animaux);
		console.log(animaux);
	}
	res.json(renvoi);
});


app.get("/server/getType", function(req, res){
	res.setHeader('Content-Type', 'application/json');
	fs.readFile('cfg/type.json', 'utf8', function (err,data) {
		if (err) {
			res.json(null);
			return console.log(err);
		}
		data = JSON.parse(data);
	  	res.json(data);
		});
});


app.get("/server/getMap", function(req, res){
	res.setHeader('Content-Type', 'application/json');
	//console.log(carte);
	res.json(carteClient);
	console.log("fichier de map envoyé");
});

app.post("/server/setMap", function(req, res){

    var map;
    for(var p in req.body){
        map = req.body[p];
    }
    fs.writeFile("cfg/map.json", map, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("Fichier de map sauvegardé");
	    carte = [];
	   	carteClient = [];
	    initialiserCarte();
	}); 

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end("Données bien reçues !");
});
initialiserCarte();
app.listen(port);
console.log("Serveur tourne sur http://localhost:"+port);

//Utilisation de socket.io pour le jeu, pour l'interface admin je fais de l'AJAX pour le moment
//https://openclassrooms.com/courses/des-applications-ultra-rapides-avec-node-js/socket-io-passez-au-temps-reel
//http://mherman.org/blog/2013/10/20/handling-ajax-calls-with-node-dot-js-and-express-scraping-craigslist/#.VtdODFn9LIU