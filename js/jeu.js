function changeObjet(objet){
    /* 
     * Permet de changer un objet possédant des méthodes dans prototype en objet sans méthode (utile pour les reqêtes AJAX)
    */
    var obj = {};
    for(var i in objet){
        if(objet.hasOwnProperty(i)){
            console.log(i);
            obj[i] = objet[i];
        }
    }
    console.log(obj);
    return obj;
}

function rejoindre(donnees, elem){
    var envoiObj = changeObjet(donnees);
        $.ajax({
            method: "POST",
            url: "http://localhost:5000/game/joinGame",
            'Content-Type': 'application/json',
            data:  envoiObj //Erreur ici, probablement impossible d'envoyer des objets avec des prototype, solution : creer une fonction qui renvoi un objet sans prototype ?
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
                //Update des joueurs

            }
        })
        .fail(function(){
            clearInterval(interval);
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });       
    }, 2000)

}