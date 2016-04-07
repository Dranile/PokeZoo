//Fichier Main (dans ce fichier on appelle différentes fonctions permettant de lancer le jeu)
var donnees;
var pseudo;

$().ready(function(){
	$("div.login input[type=button]").on("click", function(){
        pseudo = $("input#name").val();
        donnees = {
            "pseudo":pseudo
        };
        console.log(donnees);
		rejoindre(donnees, "div.login");
	});
	/*$(document).ajaxStop(function () {
		//ajaxStop permet d'attendre la fin des différentes requêtes Ajax (chargement de map)
      console.log("test");
  	});*/
	//Tout ce qui sera en dehors à partir d'ici sera lancé directement à l'ouverture de la page
});