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

function gameOver(element){
    //Envoi requete ajax au serveur pour prévenir ...
    $.ajax({
        method: "POST",
        url: "/game/mort",
        //'Content-Type': 'application/json',
        data: changeObjet(joueurP)
    }).done(function( msg ) {
            console.log( "Contrôle : " + msg );
        })
        .fail(function(){
            alert("Le serveur semble être arrêté ou a eu un problème ...");
        });
    //Reaffiche le menu ? + un message Game Over
    $("div.map").remove();
    $(element + " p").remove();
    $(element).append("<div class='gameOver'><h1>Game Over !</h1><p>Vous avez été mangé par un animal</p><a href='/jeu'>Try again</a></div>");
    $(element).show();


}

function partieFini(element){
    $("div.map").remove();
    $(element + " p").remove();
    $(element).append("<div class='gameOver'><h1>Félicitations !</h1><p>Vous avez éliminé tous les joueurs</p><a href='/jeu'>Try again</a></div>");
    $(element).show();
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
    $(elem).hide();
    // boucle principale du jeu
    var interval = setInterval(function(){
        $.ajax({
            method: "POST",
            url: "/game/updateGame",
            'Content-Type': 'application/json',
            data: changeObjet(joueurP)
        }).done(function( msg ) {
                console.log(msg);
                if(typeof msg === "object" && msg.length != 0){
                    var redessine = false;
                    
                    //console.log(msg[0]);
                    // Si il y a un mort, msg[0] possèdera un joueur en moins
                    var tab = joueurs.slice();
                    for(var i in msg[0]){
                        for(var j in joueurs){
                            if(joueurs[j]["nom"] == msg[0][i]["nom"]){
                                tab[j] = null;
                                joueurs[j].update(msg[0][i]);
                            }
                        }
                    }

                    //A ce moment, tous les joueurs dans tab sont des joueurs morts
                    for(var i in tab){
                        // Supprimer les images
                        if(tab[i] != null){
                            $("div.map svg image#" + tab[i]["nom"]).remove();
                            for(var j in joueurs){
                                if(joueurs[j]["nom"] == tab[i]["nom"]){
                                    joueurs.splice(j,1);
                                }
                            }
                        }
                    }

                    for(var i in msg[1]){
                        for(var j in animaux){
                            if(animaux[j]["nom"] == msg[1][i]["nom"]){
                                if(animaux[j]["loyaute"] != msg[1][i]["loyaute"]){
                                    redessine = true;
                                }
                                animaux[j].update(msg[1][i]);
                            }
                        }
                    }

                    var hexa = document.querySelector("[ordre='"+joueurP.hexagone+"'");
                    updateDeplacement();
                    if(redessine){
                        redessiner();    
                    }
                    //vérification si le joueurs est au meme endroit que l'animal
                    for(var i in animaux){
                        if(animaux[i].hexagone == joueurP.hexagone && joueurP.nom != animaux[i].joueurAllie["nom"] && animaux[i]["loyaute"] != 0){
                            clearInterval(interval);
                            console.log("CROQUE TU ES MORT !!!");
                            gameOver(elem);
                            return;
                        }
                    }
                }

                if(msg == "win"){
                    clearInterval(interval);
                    console.log("Vous avez gagné Felicitation");
                    partieFini(elem);
                    return;
                }
            })
            .fail(function(){
                clearInterval(interval);
                alert("Le serveur semble être arrêté ou a eu un problème ...");
            });
    }, 2000);
}