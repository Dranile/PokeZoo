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
    // /!\ faire en sorte qu'on ne puisse cliquer qu'une fois !!!! 
	$("div.login input[type=button]").on("click", function(){
        pseudo = $("input#name").val();
        if ($("input:checked[name=avatar]").val() == null){
          alert("Veuillez choisir un avatar.");
          return;
        }
        else {
          avatar = $("input:checked[name=avatar]").val();
          joueurP = creerJoueurPrincipal(pseudo, avatar);
          draw(joueurP);
          rejoindre(joueurP, "div.login");
        }
        
        
	});
	if (debug == 1){
    	$("div.login").hide();
        var pseudo = "Toto";
        var avatar = "fille1";
        joueurP = creerJoueurPrincipal(pseudo, avatar);
        draw(joueurP);
    }
	/*$(document).ajaxStop(function () {
		//ajaxStop permet d'attendre la fin des différentes requêtes Ajax (chargement de map)
      console.log("test");
  	});*/
	//Tout ce qui sera en dehors à partir d'ici sera lancé directement à l'ouverture de la page
});