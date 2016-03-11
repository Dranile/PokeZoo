var color = ""; //élément par défaut
var element = "mur"; //élément par défaut
// constantes pour la grille
var width = 6400;
var height = 3224;
var MapRows = 50;
//constantes concernant le déplacement de la carte
var x, y;

function gridClick(d){
	console.log("Clické !");
}


$().ready(function(){
	loadMap(width, height, MapRows, element);
})