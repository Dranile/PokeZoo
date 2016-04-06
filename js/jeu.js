function rejoindre(donnees, elem){
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/game/joinGame",
        'Content-Type': 'application/json',
        data:  donnees
        }).done(function( msg ) {
            console.log( "Contrôle : " + msg );
            if(msg == "bienvenue"){
                attendreJoueur(elem);
            }
            else{
                alert("La partie est pleine :(, revenez plus tard...");
            }
        })
        .fail(function(){
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });
}

function attendreJoueur(element){
    $(element + " input").remove();
    var elem = document.createElement("p");
    elem.appendChild(document.createTextNode("En attente de joueurs"));
    $(element).append(elem);
    var interval = setInterval(function(){
        $.ajax({
        url: "http://localhost:5000/game/getEtat",
        async:true
        }).done(function( msg ) {
            console.log( "Message : " + msg );
            if(msg == "pret"){
                clearInterval(interval);
                lancerPartie(element);
            }
            else{
                $(element + " p").text("En attente de joueurs : " + msg);    
            }
            
        })
        .fail(function(){
            clearInterval(interval);
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });
    }, 2000);
}

function lancerPartie(elem){
    // On enleve le message d'attente
    $(elem).remove();
    // boucle principale du jeu
    var interval = setInterval(function(){
         $.ajax({
        method: "POST",
        url: "http://localhost:5000/game/updateGame",
        'Content-Type': 'application/json',
        data:  {
                "pseudo" : pseudo
            }
        }).done(function( msg ) {
            console.log(msg);
            if(msg != null){
                //Update de la carte
            }
        })
        .fail(function(){
            clearInterval(interval);
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });       
    }, 2000)

}