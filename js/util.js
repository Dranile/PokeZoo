//Variable pour numéroter les hexagones
var ordreHexagon = 0;
var ordreHexagoneActuel = 507;
//variable pour placer le personnage au centre
var xPersonnage = 485 , yPersonnage = 310;
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
function ordreHexagone(){
    
    ordreHexagon++;
    return ordreHexagon;
}
var centrex = 389.97831388645;
var centrey = 250.7661851649874;
var textvar = 10;
//Function pour placer le personnage au centre
function placementCentre(){
    
    d3.select(".fille1")
     .attr("transform", "translate(" + centrex +","+ centrey +")");
}

function gridClick(d){
       // console.log(this);
       // console.log("class : " + this.getAttribute("class"));
       // console.log("type : " + this.getAttribute("class").split(" ")[1]);
        var terrain = this.getAttribute("class").split(" ")[1];
        var hexa = this.getAttribute("ordreHexagone");
        var hexax = this.getAttribute("x");
        var hexay = this.getAttribute("y");
        
        /*
        console.log("Hexa : " + hexa);
       var testHexaActuel = joueurP.getHexagone();
        console.log("HexaActuel :" + testHexaActuel);
        */
        //joueurs[0].UpdateDeplacer(joueurP.getPosX(),joueurP.getPosY(),joueurP.getHexagone());
       // joueurs[0].deplacer();
      if (terrain == "mur") {
        alert("impossible de se deplacer sur cette case");  
       }
       else {
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
         
        
       }

       DeplacerPersonnage(hexax,hexay);
        joueurP.UpdateDeplacer(hexax,hexay, hexa);
        ordreHexagoneActuel = hexa;

        var testHexaActuel = joueurP.getHexagone();
        console.log("HexaActuel :" + testHexaActuel);

        var testPosition = joueurP.getPosition();
        console.log("Position actuelle :"+testPosition);

        /*
        if(hexa == ordreHexagoneActuel+1 || hexa == ordreHexagoneActuel -1){
          ordreHexagoneActuel = hexa;
        	console.log("HexagoneActuel après : "+ordreHexagoneActuel);
        	DeplacerPersonnage(hexax,hexay);

        }
        
        if(hexa == ordreHexagoneActuel-100 || hexa == ordreHexagoneActuel-101){

        		ordreHexagoneActuel = hexa;
        		console.log("HexagoneActuel après : "+ordreHexagoneActuel);
        		DeplacerPersonnage(hexax,hexay);
        } 
        	
        if(hexa == ordreHexagoneActuel+100 || hexa == ordreHexagoneActuel+99) {
        	
        	ordreHexagoneActuel = hexa;
        	console.log("HexagoneActuel après : "+ordreHexagoneActuel);
        	DeplacerPersonnage(hexax,hexay);
		}
		*/
        //DeterminerDeplacement(hexa); 
        
    
    //console.log("Clické !");
}

function DeplacerPersonnage(hexax,hexay){
    
    /*
     d3.select(".image")
     .attr("transform", "translate(" + hexax +","+ hexay +")");
*/
    var elem = d3.select("div.map");
    elem.style("background-position", (centrex-hexax) + "px " + (centrey-hexay) + "px");
    
    elem.select("g")
      .attr("transform", "translate(" + (centrex-hexax) +","+ (centrey-hexay) +")");
      
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
	// var coef = width / height;
	// var nbColonnes = nbLignes * coef;

	var distance = rayon - rayon*Math.cos(30*Math.PI/180);
       //console.log("distance = "+distance);

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
           .attr("ordreHexagone",ordreHexagone)
	       .classed(element, true)
		   .on("mouseover", mover)
		   .on("mouseout", mout)
		   .style("fill-opacity", 0)
		   .on("click", gridClick)
		   .attr("x",dx- rayon +10)
           .attr("y",dy- rayon +10)

		}
	}

		   // .attr("fill", "white")
     //       .attr("id", ligne+" "+colonne)
     //       .on("click", function(d) {
     //           console.log(d3.select(this).attr('id'));
     //     	});

		$.ajax({
		url: "http://localhost:5000/server/getMap",
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
				alert("Il y a eu une erreur");
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
                                 .attr("xlink:href", "img/"+JoueurP.image)
                                 .attr("width", 50)
                                 .attr("height", 50)
                                .attr("id","image")
                                 .attr("class","JoueurPrincipal");


ajouterAutreJoueur('roxas', 'garcon2');

    d3.select(".map").selectAll("svg")
                                .append("svg:image")
                                 .attr("xlink:href", "img/"+joueurs[0].image)
                                 .attr("width", 50)
                                 .attr("height", 50)
                                .attr("id","image")
                                 .attr("class","Joueur");


}

// function loadMap(width, height, MapRows, element){


// 	// ========================================
// 	//          initialisation de la grille
// 	// ========================================

// 	//The number of columns and rows of the heatmap

// 	var coef = width / height;
// 	var MapColumns = MapRows * coef;

// 	//The maximum radius the hexagons can have to still fit the screen
// 	var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
// 		height/((MapRows + 1/3) * 1.5)]);

// 	//Set the new height and width of the SVG based on the max possible
// 	width = MapColumns*hexRadius*Math.sqrt(3);
// 	heigth = MapRows*1.5*hexRadius+0.5*hexRadius;

// 	//Set the hexagon radius
// 	var hexbin = d3.hexbin()
// 		.radius(hexRadius);

// 	$.ajax({
// 		url: "http://localhost:5000/server/getMap",
// 		async: true
// 	}).done(function(donnee) {
// 			if(donnee != "null"){
// 				map=donnee;

// 				//Calculate the center positions of each hexagon
// 				var points = [];
// 				for (var i = 0; i < MapRows; i++) {
// 					for (var j = 0; j < MapColumns; j++) {
// 						points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
// 					}
// 				}


// 				//Create SVG element

// 				var svg;

// 				svg = d3.select(".map").append("svg")
// 					.attr("xmlns", "http://www.w3.org/2000/svg")
// 					.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
// 					.attr("width", width)
// 					.attr("height", height)
// 					.append("g");
                                
//                                 //Attache l'image du guepard à la map
//                                  d3.select(".map").selectAll("svg")
//                                 .append("svg:image")
//                                 .attr("xlink:href", "img/fille1.png")
//                                 .attr("width", 50)
//                                 .attr("height", 50)
//                                 .attr("id","image")
//                                 .attr("class","fille1");
//                                 d3.select(".map").selectAll("svg")
//                                 .append("svg:image")
//                                 .attr("xlink:href", "img/garcon1.png")
//                                 .attr("width", 50)
//                                 .attr("height", 50)
//                                 .attr("id","image")
//                                 .attr("class","garcon1");
//                                 placementCentre();
// 				/*
// 				 // Marche pas :(
// 				 svg.append("image")
// 				 .attr("x", 0)
// 				 .attr("y", 0)
// 				 .attr("xlink:href", "../img/map_zoo.png")
// 				 .attr("width","1000px")
// 				 .attr("height","650px");
// 				 */


// 				//Génère les hexagon de base
// 				svg.selectAll(".hexagon")
// 					.data(hexbin(points))
// 					.enter().append("path")
// 					.attr("class", "hexagon")
// 					.attr("d", function (d) {
// 						return "M" + d.x + "," + d.y + hexbin.hexagon();
// 					})
// 					.attr("x",function(d){
//                         return d.x - hexRadius +10;
//                                         })
//                     .attr("y",function(d){
//                         return d.y - hexRadius +10;
//                     })
// 					.attr("stroke", function (d,i) {
// 						return "#000";
// 					})
// 					.attr("stroke-width", "1px")
//                     .attr("ordreHexagone",ordreHexagone)
// 					.classed(element, true)
// 					.on("mouseover", mover)
// 					.on("mouseout", mout)
// 					.style("fill-opacity", 0)
// 					.on("click", gridClick);

// 				//Génère la map chargée
// 				d3.selectAll(".hexagon")
// 					.data(map)
// 					.each(function(data){
// 						if(data.type != element){
// 							this.setAttribute("class","hexagon " + data.type);
// 							$(this).css("fill-opacity", 0.5);
// 							$(this).css("fill",data.color);
// 						}
// 					});

// 			}
// 			else{
// 				alert("Il y a eu une erreur");
// 			}
// 		})
// 		.fail(function(){
// 			alert("Il y a eu une erreur avec le serveur, il est peut être déconnecté");
// 		});
// };

