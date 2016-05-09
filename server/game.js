var fs = require('fs');

exports.initPartie = function(players, callback){
	var map;
	fs.readFile('cfg/map.json', 'utf8', function (err,data) {
		if (err) {
			res.json("null");
			return console.log(err);
		}
		map = JSON.parse(data);
		if(map != null){
			var spawns = [];
			for(var i = 0; i<map.length;i++){
				if(map[i]["type"] == "spawn"){
					spawns.push(i);
				}
			}
			console.log("tableau de spawns :" + spawns);
			for(var i in players){
				var rand = Math.floor((Math.random() * spawns.length));
				players[i]["hexagone"] = spawns[rand];
				spawns.splice(rand,1);
			}
		}
		if(typeof callback === "function"){
			callback(players);	
		}
	});
	
}