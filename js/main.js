//Fichier Main (dans ce fichier on appelle différentes fonctions permettant de lancer le jeu)
var joueurP;
var pseudo;
var debug = 1;

$().ready(function(){
  draw();
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
          dessiner(joueurP);
          rejoindre(joueurP, "div.login");
        }
        
        
	});
	if (debug == 1){
    	$("div.login").hide();
        var pseudo = "Toto";
        var avatar = "fille1";
        joueurP = creerJoueurPrincipal(pseudo, avatar);
        ajouterAutreJoueur('roxas', 'garcon2');
        ajouterAutreJoueur('shepard', 'garcon1');
        joueurP.hexagone = 1045;
        //joueurs[0].hexagone = 1046;
        joueurs[0].hexagone = 302;
        joueurs[1].hexagone = 903;
        dessiner(joueurP);
        PositionnerImages();
        var hexa = document.querySelector("[ordreHexagone='"+joueurP.hexagone+"'");
        DeplacerPersonnage(hexa,1);
        tidCha = setTimeout(chasse,2000,joueurs[0]);

        
    }
	/*$(document).ajaxStop(function () {
		//ajaxStop permet d'attendre la fin des différentes requêtes Ajax (chargement de map)
      console.log("test");
  	});*/
	//Tout ce qui sera en dehors à partir d'ici sera lancé directement à l'ouverture de la page
});