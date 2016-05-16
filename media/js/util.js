//Variable pour numéroter les hexagones
var ordreHexagon = -1;
//Fonction quand on passe la souris sur une case


function mover(d) {
	var el = d3.select(this)
		.transition()
		.duration(10)
		.style("fill-opacity", 0.5);
}

//Fonction lorsque la souris sort de la case
function mout(d) {
	var el = d3.select(this);
	if(el.classed("hexagon") == true  && el.classed("mur") == true){
		el.transition()
			.duration(10)
			.style("fill-opacity", 0);
	}
};




//Function pour numéroter les hexagones durant la mise en place de leurs attributions
function ordre(){

	ordreHexagon++;
	return ordreHexagon;
}
var centrex;
var centrey;
var textvar = 10;
//Function pour placer le personnage au centre
function placementCentre(){

	d3.select(".fille1")
		.attr("transform", "translate(" + centrex +","+ centrey +")");
}



function gridClick(){
	var terrain = this.getAttribute("class").split(" ")[1];
	var ordreHexa = this.getAttribute("ordre");
	var hexa = document.querySelector("[ordre='"+ordreHexa+"'");
	if (terrain == "mur") {
		//alert("impossible de se deplacer sur cette case");
	}
	else {
		if (VerificationProximite(parseInt(ordreHexa))){
			DeplacerPersonnage(hexa,0);
			joueurP.UpdateDeplacer(ordreHexa);

			if (terrain == "viande" || terrain == "poisson"){
				joueurP.prendreNourriture(terrain);
				redessiner();
			}
			if (terrain == "guepard" || terrain == "loup" || terrain == "lion" || terrain == "ours"){
				for (i in animaux){
					if (animaux[i].nom == terrain){
						joueurP.nourrir(animaux[i]);
						redessiner();
					}

				}

			}

			//ajout pour test fonction listeHexaEligible()
			//listeHexaEligible(joueurP.hexagone);

			/*var listevide = [];
			var liste = pathfinding(joueurs[0].hexagone, joueurP, listevide);
			console.log("chemin -> " );
			for (var i in liste){
				console.log(liste[i].hexagone);
			}*/

			//A remettre pour reactiver le pathfinding

			/*
			var listevide = [];
			joueurs[0].hexagone = 2668;
			joueurs[1].hexagone = 2963;
			dessiner(joueurP);
			PositionnerImages();
			var liste = pathfinding(joueurs[0].hexagone, joueurs[1], listevide);
			console.log("chemin test pathfinding -> " );
			for (var i in liste){
				console.log(liste[i].hexagone);
			}
			*/
		}
	}
	
	
}

/**
 * @return {boolean}
 */
function DeplacementChemin(liste,animal){ //attention a la recursion, ca bouclait a l'infini
	if (liste.length>0){ //la verif cest ici sinon la console gueule sans s'arreter ^^
		var ordreHexa = liste.shift();

		animal.hexagone = ordreHexa.hexagone;
		console.log("Ordre hexa deplacement chemin :" +ordreHexa.hexagone);
		updateDeplacement();
		if(liste.length != 0) tid = setTimeout(DeplacementChemin,1000,liste,animal);
		else clearTimeout(tid);
	}

}

function VerificationProximite(ordreHexa){
	var hexaActuel = parseInt(joueurP.hexagone);

	if ((parseInt(hexaActuel/148)%2) == 0){ //148 hexagone par ligne //si le numero de ligne est pair (en commencant par 0)
		if(ordreHexa == hexaActuel+147 || ordreHexa == hexaActuel+148
			|| ordreHexa == hexaActuel +1 || ordreHexa == hexaActuel -1
			|| ordreHexa == hexaActuel-148 || ordreHexa == hexaActuel -149){
			return true;
		}
		else{
			return false;
		}
	}
	else {
		if(ordreHexa == hexaActuel+148 || ordreHexa == hexaActuel +149
			|| ordreHexa == hexaActuel +1 || ordreHexa == hexaActuel -1
			|| ordreHexa == hexaActuel -147	|| ordreHexa == hexaActuel-148){
			return true;
		}
		else{
			return false;
		}
	}
}

//Fonction permettant d'effectuer le mouvement du personnage principal
function DeplacerPersonnage(hexa,start){
	 //On récupère les positions du centre du nouvel hexagone du personnage principal
	var hexax = hexa.getAttribute("x");
	var hexay = hexa.getAttribute("y");

	//Déplacement du Background
	var elem = d3.select("div.map");
	elem.style("background-position", (centrex-hexax) + "px " + (centrey-hexay) + "px");

	//Déplacement de la grille
	elem.select("g")
		.attr("transform", "translate(" + (centrex-hexax) +","+ (centrey-hexay) +")");

	RepositionnerImages(hexa,start);
	 
}
/*Fonction permettant de repositionner les images de tous les autres joueurs et des animaux après un déplacement
du joueur principal*/
function RepositionnerImages(hexa,start){

	var hexax = hexa.getAttribute("x");
	var hexay = hexa.getAttribute("y");
	var	hexaPrec;

	//On récupère l'hexagone sur lequel était le Joueur principal avant de se déplacer
	if(start == 0){	
		console.log(start);
		hexaPrec = document.querySelector("[ordre='"+joueurP.hexagone+"'");
	}
	else{
		console.log(start);
		hexaPrec = document.querySelector("[ordre='"+1045+"'");
	}
	//On récupère les valeurs du centre de l'hexagone sur lequel était le joueur principal
	var xprec = parseInt(hexaPrec.getAttribute("x"));
	var yprec = parseInt(hexaPrec.getAttribute("y"));
	
	for(var i in joueurs){

		//On récupère l'image du joueur que l'on souhaite décaler
		var joueur = document.querySelector("[id='"+joueurs[i].nom+"'");
		//On récupère les valeurs du décalage déjà subit par l'image
		var décalagex = parseInt(joueur.getAttribute("décalagex"));
		var décalagey = parseInt(joueur.getAttribute("décalagey"));

		//On additionne les valeurs du décalage déjà subit par l'image avec le nouveau décalage à effectuer
		décalagex+= xprec - parseInt(hexax);
		décalagey+= yprec - parseInt(hexay);
	

		//On récupère l'hexagone sur lequel se situe le joueur à décaler
		var HexaCentre = document.querySelector("[ordre='"+joueurs[i].hexagone+"'");
		//On récupère les valeurs du centre de l'hexagone sur lequel se situe le joueur à décaler
		var Joueurx = parseInt(HexaCentre.getAttribute("x"));
		var Joueury = parseInt(HexaCentre.getAttribute("y"));
	
		//On bouge l'image pour la décaler et on change les valeurs de décalage de l'image
	 	d3.select("#"+joueurs[i].nom)
	 		.attr("transform", "translate(" +  (Joueurx+décalagex) +","+ (Joueury+décalagey) +")")
	 		.attr("décalagex",décalagex)
	 		.attr("décalagey",décalagey);
	}

	for(var i in animaux){

		//On récupère l'image du joueur que l'on souhaite décaler
		var animal = document.querySelector("[id='"+animaux[i].nom+"'");
		//On récupère les valeurs du décalage déjà subit par l'image
		var décalagex = parseInt(animal.getAttribute("décalagex"));
		var décalagey = parseInt(animal.getAttribute("décalagey"));

		//On additionne les valeurs du décalage déjà subit par l'image avec le nouveau décalage à effectuer
		décalagex+= xprec - parseInt(hexax);
		décalagey+= yprec - parseInt(hexay);
	

		//On récupère l'hexagone sur lequel se situe le joueur à décaler
		var HexaCentre = document.querySelector("[ordre='"+animaux[i].hexagone+"'");
		//On récupère les valeurs du centre de l'hexagone sur lequel se situe le joueur à décaler
		var Animalx = parseInt(HexaCentre.getAttribute("x"));
		var Animaly = parseInt(HexaCentre.getAttribute("y"));
	
		//On bouge l'image pour la décaler et on change les valeurs de décalage de l'image
	 	d3.select("#"+animaux[i].nom)
	 		.attr("transform", "translate(" +  (Animalx+décalagex) +","+ (Animaly+décalagey) +")")
	 		.attr("décalagex",décalagex)
	 		.attr("décalagey",décalagey);
	}
}

function updateDeplacement(){

	for(var i in joueurs){

		//On récupère l'image du joueur que l'on souhaite décaler
		var joueur = document.querySelector("[id='"+joueurs[i].nom+"'");
		//On récupère les valeurs du décalage déjà subit par l'image
		var décalagex = parseInt(joueur.getAttribute("décalagex"));
		var décalagey = parseInt(joueur.getAttribute("décalagey"));

		//On récupère l'hexagone sur lequel se situe le joueur à décaler
		var HexaCentre = document.querySelector("[ordre='"+joueurs[i].hexagone+"'");
		//On récupère les valeurs du centre de l'hexagone sur lequel se situe le joueur à décaler
		var Joueurx = parseInt(HexaCentre.getAttribute("x"));
		var Joueury = parseInt(HexaCentre.getAttribute("y"));
	
		//On bouge l'image pour la décaler et on change les valeurs de décalage de l'image
	 	d3.select("#"+joueurs[i].nom)
	 		.attr("transform", "translate(" +  (Joueurx+décalagex) +","+ (Joueury+décalagey) +")")
	 		.attr("décalagex",décalagex)
	 		.attr("décalagey",décalagey);
	}

	for(var i in animaux){

		//On récupère l'image du joueur que l'on souhaite décaler
		var animal = document.querySelector("[id='"+animaux[i].nom+"'");
		//On récupère les valeurs du décalage déjà subit par l'image
		var décalagex = parseInt(animal.getAttribute("décalagex"));
		var décalagey = parseInt(animal.getAttribute("décalagey"));

		//On récupère l'hexagone sur lequel se situe le joueur à décaler
		var HexaCentre = document.querySelector("[ordre='"+animaux[i].hexagone+"'");
		//On récupère les valeurs du centre de l'hexagone sur lequel se situe le joueur à décaler
		var Animalx = parseInt(HexaCentre.getAttribute("x"));
		var Animaly = parseInt(HexaCentre.getAttribute("y"));
	
		//On bouge l'image pour la décaler et on change les valeurs de décalage de l'image
	 	d3.select("#"+animaux[i].nom)
	 		.attr("transform", "translate(" +  (Animalx+décalagex) +","+ (Animaly+décalagey) +")")
	 		.attr("décalagex",décalagex)
	 		.attr("décalagey",décalagey);
	}
}

function creeHexagone(rayon) {
	var points = new Array();
	for (var i = 0; i < 6; ++i) {
		var angle = i * Math.PI / 3;
		var x = Math.sin(angle) * rayon;
		var y = -Math.cos(angle) * rayon;
		points.push([Math.round(x*100)/100, Math.round(y*100)/100]);
	}
	return points;
}


function loadMap(width, height, rayon, element){
	var nbLignes = height/(1.5*rayon) + 2;
	var nbColonnes = width / (1.74*rayon);
	var distance = rayon - rayon*Math.cos(30*Math.PI/180);

	d3.select(".map").append("svg")
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
		.attr("width", width)
		.attr("height", height)
		.append("g");

	for (var ligne=0; ligne < nbLignes; ligne++) {
		for (var colonne=0; colonne < nbColonnes; colonne++) {
			var hexagone = creeHexagone(rayon);
			var d = "";
			var x, y;
			for (h in hexagone) {
				// Si ligne impair, décalage des hexagones d'un rayon
				if (ligne % 2) x = hexagone[h][0]+(rayon-distance)*(2+2*colonne);
				else           x = hexagone[h][0]+(rayon-distance)*(1+2*colonne);
				y = distance*2 + hexagone[h][1]+(rayon-distance*2)*(1+2*ligne);
				if (h == 0){
					d += "M"+x+","+y+" L";
					var dx = x;
					var dy = y;
				}
				else{
					d +=     x+","+y+" ";
				}
			}
			d += "Z";
			d3.select(".map svg g")
				.append("path")
				.attr("class", "hexagon")
				.attr("d", d)
				.attr("stroke", function (d,i) {
					return "#000";
				})
				.attr("stroke-width", "1px")
				.attr("ordre",ordre)
				.classed(element, true)
				.on("mouseover", mover)
				.on("mouseout", mout)
				.style("fill-opacity", 0)
				.on("click", gridClick)
				.attr("x",dx- rayon)
				.attr("y",dy- rayon +20)

		}
	}

	$.ajax({
		url: "/server/getMap",
		async: true
	}).done(function(donnee) {
			if(donnee != "null"){
				var map=donnee;

				d3.selectAll(".hexagon")
					.data(map)
					.each(function(data){
						if(data.type != element){
							this.setAttribute("class","hexagon " + data.type);
							$(this).css("fill-opacity", 0.5);
							$(this).css("fill",data.color);
						}
					});
			}
			else{
				alert("la carte n'est pas initialisée, veuillez contacter un administrateur.");
			}
		})
		.fail(function(){
			alert("Il y a eu une erreur avec le serveur, il est peut être déconnecté");
		});
}

function PositionnerImages(){
	//Placement du joueur principal
	d3.select(".map").selectAll("svg")
		.append("svg:image")
		.attr("xlink:href", "/media/img/"+joueurP.image)
		.attr("width", 50)
		.attr("height", 50)
		.attr("id","image")
		.attr("class","JoueurPrincipal");

//On place le joueur principal à son point de départ
	

	var HexaCentre = document.querySelector("[ordre='"+1045+"'");
	centrex = HexaCentre.getAttribute("x");
	centrey = HexaCentre.getAttribute("y");

	d3.select(".JoueurPrincipal")
		.attr("transform", "translate(" + centrex +","+ centrey +")");

//On place les autres joueurs à leur point de départ
	
	for(var i in joueurs){

		d3.select(".map").selectAll("svg")
		.append("svg:image")
		.attr("xlink:href", "/media/img/"+joueurs[i].image)
		.attr("width", 50)
		.attr("height", 50)
		.attr("id",joueurs[i].nom)
		.attr("class","Joueur")
		.attr("décalagex",0)
		.attr("décalagey",0);

		var HexaCentre = document.querySelector("[ordre='"+joueurs[i].hexagone+"'");
		var Joueurx = HexaCentre.getAttribute("x");
		var Joueury = HexaCentre.getAttribute("y");

		d3.select("#"+joueurs[i].nom)
		.attr("transform", "translate(" + Joueurx +","+ Joueury +")");

	}

	for(var i in animaux){

		d3.select(".map").selectAll("svg")
		.append("svg:image")
		.attr("xlink:href", "/media/img/"+animaux[i].nom+".png")
		.attr("width", 50)
		.attr("height", 50)
		.attr("id",animaux[i].nom)
		.attr("class","Animal")
		.attr("décalagex",0)
		.attr("décalagey",0);

		var HexaCentre = document.querySelector("[ordre='"+animaux[i].hexagone+"'");
		var Animalx = HexaCentre.getAttribute("x");
		var Animaly = HexaCentre.getAttribute("y");

		d3.select("#"+animaux[i].nom)
		.attr("transform", "translate(" + Animalx +","+ Animaly +")");

	}
}