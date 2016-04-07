//Fichier Main (dans ce fichier on appelle différentes fonctions permettant de lancer le jeu)
var joueurP;
var pseudo;
var debug = 0;

//Création de personnage pour un test
/*
joueurP = creerJoueurPrincipal("Test", 'fille1');
ajouterAutreJoueur("Test2", "garcon1");*/
//

$().ready(function(){
	$("div.login input[type=button]").on("click", function(){
        pseudo = $("input#name").val();
        joueurP = creerJoueurPrincipal(pseudo, 'fille1');
        console.log(joueurP);
        draw(joueurP);
        rejoindre(joueurP, "div.login");
	});
	if (debug == 1){
    	$("div.login").hide();
    }
	/*$(document).ajaxStop(function () {
		//ajaxStop permet d'attendre la fin des différentes requêtes Ajax (chargement de map)
      console.log("test");
  	});*/
	//Tout ce qui sera en dehors à partir d'ici sera lancé directement à l'ouverture de la page
});