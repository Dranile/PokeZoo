var fs = require('fs');

exports.initPartie = function(players,animaux, callback){
	var map;
	fs.readFile('cfg/map.json', 'utf8', function (err,data) {
		if (err) {
			res.json("null");
			return console.log(err);
		}
		map = JSON.parse(data);
		if(map != null){
			var spawns = [];
			var cage = {
				"loup":[],
				"guepard":[],
				"ours":[],
				"lion":[]
			}

			for(var i = 0; i<map.length;i++){
				switch(map[i]["type"]){
					case "spawn":
						spawns.push(i);
					break;
					case "loup":
						cage["loup"].push(i);
					break;
					case "guepard":
						cage["guepard"].push(i);
					break;
					case "ours":
						cage["ours"].push(i);
					break;
					case "lion":
						cage["lion"].push(i);
					break;

				}
			}
			console.log("tableau de spawns :" + spawns);
			for(var i in players){
				var rand = Math.floor((Math.random() * spawns.length));
				players[i]["hexagone"] = spawns[rand];
				spawns.splice(rand,1);
			}

			for(var i in animaux){
				var tabSpawnAnimal = cage[animaux[i]["nom"]];
				console.log(tabSpawnAnimal);
				var rand = Math.floor((Math.random() * tabSpawnAnimal.length));
				animaux[i]["hexagone"] = tabSpawnAnimal[rand];
			}
		}
		if(typeof callback === "function"){
			callback(players, animaux);	
		}
	});
	
}