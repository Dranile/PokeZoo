var donnees;
var pseudo;
var posX = 0;
var posY = 0;

$().ready(function(){
	$("input[type=button]").on("click", function(){
        pseudo = $("input#name").val();
        donnees = {
            "pseudo":pseudo
        }
        console.log(donnees);
		rejoindre();
	});
});

function lancerModifier(){
    var elem = document.createElement("input");
    elem.setAttribute("type","button");
    elem.setAttribute("value","posX +");
    elem.setAttribute("id","x");
    elem.addEventListener("click", function(){
        posX++;
    },false);
    document.querySelector(".map").appendChild(elem);
    var elem = document.createElement("input");
    elem.setAttribute("type","button");
    elem.setAttribute("value","posY +");
    elem.setAttribute("id","y");
    elem.addEventListener("click", function(){
        posY++;
    },false);
    document.querySelector(".map").appendChild(elem);
}

function afficherObjets(obj){
    $(".map ul").remove();
    for(var i in obj){
        var elem = document.createElement("ul");
        for(var p in obj[i]){
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(p +" : " + obj[i][p]));
            elem.appendChild(li);
        }
        $(".map").append(elem);
    }
}

function lancerPartie(){
    // On enleve le message d'attente
    $(".map p").remove();
    // à commenter au moment de l'implémentation
    lancerModifier();
    // boucle principale du jeu
    var interval = setInterval(function(){
         $.ajax({
        method: "POST",
        url: "http://localhost:5000/game/updateGame",
        'Content-Type': 'application/json',
        data:  {
                "pseudo" : pseudo,
                "x" : posX,
                "y" :posY
            }
        }).done(function( msg ) {
            afficherObjets(msg);
            console.log(msg);
        })
        .fail(function(){
            clearInterval(interval);
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });       
    }, 2000)

}

function attendreJoueur(){
    $(".map input").css("display","none");
    var elem = document.createElement("p");
    elem.appendChild(document.createTextNode("En attente de joueurs"));
    document.querySelector(".map").appendChild(elem);
    var interval = setInterval(function(){
        $.ajax({
        url: "http://localhost:5000/game/getEtat",
        async:true
        }).done(function( msg ) {
            console.log( "Message : " + msg );
            if(msg == "pret"){
                clearInterval(interval);
                lancerPartie();
            }
            else{
                $(".map p").text("En attente de joueurs : " + msg);    
            }
            
        })
        .fail(function(){
            clearInterval(interval);
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });
    }, 2000);
    
}

function rejoindre(){
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/game/joinGame",
        'Content-Type': 'application/json',
        data:  donnees
        }).done(function( msg ) {
            console.log( "Contrôle : " + msg );
            if(msg == "bienvenue"){
                attendreJoueur();
            }
            else{
                alert("La partie est pleine :(, revenez plus tard...");
            }
        })
        .fail(function(){
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });
}