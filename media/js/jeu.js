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

function nourrirServeur(joueur, animal){

    // ----------------------------------- Methode 2 ----------------------------------
    $.ajax({
        method: "POST",
        url: "/game/nourrir",
        //'Content-Type': 'application/json',
        data: {"nomJoueur":joueur["nom"],"nomAnimal":animal["nom"]}
        }).done(function( msg ) {
            console.log( "Contrôle : " + msg );
        })
        .fail(function(){
            alert("Le serveur semble être arrêté ou a eu un problème ...");
    });

    //--------------------------------- Methode 1: voir dans app.js --------------------
    /*var a = changeObjet(animal);
    console.log(a);
    $.ajax({
        method: "POST",
        url: "/game/nourrir",
        //'Content-Type': 'application/json',
        data: {"data": JSON.stringify(a)}
        }).done(function( msg ) {
            console.log( "Contrôle : " + msg );
        })
        .fail(function(){
            alert("Le serveur semble être arrêté ou a eu un problème ...");
    });*/
}


function rejoindre(joueurP, elem){
    var envoiObj = changeObjet(joueurP);
        $.ajax({
            method: "POST",
            url: "/game/joinGame",
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
        url: "/game/getEtat",
        async:true
        }).done(function( msg ) {
            console.log(msg);
            if(typeof msg === "object"){
                clearInterval(interval);
                for(var i in msg){
                    if(msg[i]["nom"] == joueurP["nom"]){
                        joueurP.update(msg[i]);
                    }
                    else{
                        var image = msg[i]["image"].split('.');
                        ajouterAutreJoueur(msg[i]["nom"],image[0]);
                        joueurs[joueurs.length-1].update(msg[i]);
                    }
                }
                PositionnerImages();
                var hexa = document.querySelector("[ordre='"+joueurP.hexagone+"'");

                DeplacerPersonnage(hexa,1);
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
        url: "/game/updateGame",
        'Content-Type': 'application/json',
        data: changeObjet(joueurP)
        }).done(function( msg ) {
            if(msg != null){
                //Update des positions joueurs etc ...
                // l'objet obtenu est un tableau de personnage (attention il n'y a paq de fonction prototype dedans ...)
                for(var i in msg[0]){
                    if(msg[0][i]["nom"] == joueurP["nom"]){
                        //Je pense que c'est cette ligne qui est responsable du bug de déplacement, le joueur déplace, mais le serveur met à jour
                        //joueurP.update(msg[0][i]);

                    }
                    else{
                        for(var j in joueurs){
                            if(joueurs[j]["nom"] == msg[0][i]["nom"]){
                                joueurs[j].update(msg[0][i]);
                            }
                        }
                    }
                }
                for(var i in msg[1]){
                    for(var j in animaux){
                        if(animaux[j]["nom"] == msg[1][i]["nom"]){
                            animaux[j].update(msg[1][i]);
                        }
                    }
                }

                var hexa = document.querySelector("[ordre='"+joueurP.hexagone+"'");
                updateDeplacement();
                
                redessiner();
            }
        })
        .fail(function(){
            clearInterval(interval);
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });       
    }, 2000);
}