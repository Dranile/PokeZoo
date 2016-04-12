function changeObjet(objet){
    /* 
     * Permet de changer un objet possédant des méthodes dans prototype en objet sans méthode (utile pour les reqêtes AJAX)
    */
    var obj = {};
    for(var i in objet){
        if(objet.hasOwnProperty(i)){
            obj[i] = objet[i];
        }
    }
    return obj;
}

function rejoindre(joueurP, elem){
    var envoiObj = changeObjet(joueurP);
        $.ajax({
            method: "POST",
            url: "http://localhost:5000/game/joinGame",
            'Content-Type': 'application/json',
            data:  envoiObj
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
    $(element + " form").remove();
    var elem = document.createElement("p");
    elem.appendChild(document.createTextNode("En attente de joueurs"));
    $(element).append(elem);
    var interval = setInterval(function(){
        $.ajax({
        url: "http://localhost:5000/game/getEtat",
        async:true
        }).done(function( msg ) {
            console.log(msg);
            if(typeof msg === "object"){
                clearInterval(interval);
                for(var i in msg){
                    if(msg[i]["nom"] == joueurP["nom"]){
                        joueurP.UpdateDeplacer(msg[i]["positionX"],msg[i]["positionY"],msg[i]["hexagone"]);
                    }
                }
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
        data: changeObjet(joueurP)
        }).done(function( msg ) {
            if(msg != null){
                //Update des positions joueurs etc ...
                // l'objet obtenu est un tableau de personnage (attention il n'y a paq de fonction prototype dedans ...)
            }
        })
        .fail(function(){
            clearInterval(interval);
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });       
    }, 2000);
}