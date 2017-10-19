var tidDep;
var tidCha

function Personnage(nom){
    this.nom = nom;
    this.positionX = 0;
    this.positionY = 0;
    this.hexagone = 0;

}
Personnage.prototype.deplacer = function(posX, posY,hexa) {
    this.positionX = posX;
    this.positionY = posY;
    this.hexagone = hexa;
};

Personnage.prototype.getHexagone = function(){
    return this.hexagone;
};

// ANIMAUX
function Animal(nom, nourriture){
    Personnage.call(this, nom);
    this.alimentation = nourriture;
    this.loyaute = 0;
    this.loyauteMax = 1;
    this.joueurAllie = null;
    this.niveau = [];
    this.libre = 0;

}
Animal.prototype.definirJoueurAllie = function(players){
    var max = 0;
    var nouvelAllie;
    for (allie in this.niveau) {
        if (this.niveau[allie] > max){
            max = this.niveau[allie];
            nouvelAllie = allie;

        }
        for(var i in players){
            if(nouvelAllie == players[i]["nom"]){
                this.joueurAllie = players[i];
            }
        }
    }
    return players;
};
Animal.prototype.nourriPar = function(joueur, players){
    if (this.loyaute<this.loyauteMax){
        this.loyaute+=1;

        if (joueur.nom in this.niveau){
            this.niveau[joueur.nom] += 1 ;
        }
        else {
            this.niveau[joueur.nom] = 1 ;
        }

        if (this.loyaute == this.loyauteMax) {
            this.definirJoueurAllie(players);
            this.joueurAllie.animaux.push(this.nom);
            this.libre = 1;
        }
    }
    return players;
};
Animal.prototype.update = function(animal){
    if (animal.nom == this.nom) {
        this.positionX = animal.positionX;
        this.positionY = animal.positionY;
        this.hexagone = animal.hexagone;
        this.loyaute = animal.loyaute;
        this.joueurAllie = animal.joueurAllie;
        this.niveau = animal.niveau;
        this.libre = animal.libre;
    }
};

// JOUEURS
function Joueur(nom, image){
    Personnage.call(this, nom);
    this.image = image+'.png';
    this.nourriture = "";
    this.animaux = [];
}

Joueur.prototype.UpdateDeplacer = function(hexa) {
    this.hexagone = hexa;
};

Joueur.prototype.deplacer = function(){
    var imag = this.image.split(".");
    console.log(imag[0]);
    d3.select("."+imag[0])
        .attr("transform", "translate(" + this.positionX +","+ this.positionY +")");
};

Joueur.prototype.getHexagone = function(){
    return this.hexagone;
};

Joueur.prototype.getPosition = function(){
    return "x : "+this.positionX+", y : "+this.positionY;

};

Joueur.prototype.prendreNourriture = function(nourriture){
    if (this.nourriture == ""){
        this.nourriture = nourriture;
    }
    else{
        console.log("impossible de prendre davantage de nourriture");
    }
};
Joueur.prototype.nourrir = function(animal,players){
    animal.nourriPar(this,players);
    this.nourriture = "";
    return players;
};
Joueur.prototype.update = function(joueur){
    this.UpdateDeplacer(joueur.hexagone);
    if(joueur.animaux != null){
        this.animaux = joueur.animaux;
    }

};

function listeHexaEligible(position,carte) { //mis sur joueur pour test vu que aucun animal initialisé
    var liste = [];
    var posAnimal = parseInt(position);
    var numHexaHG, numHexaHD, numHexaG, numHexaD, numHexaBG, numHexaBD;

    if ((parseInt(posAnimal/148)%2) == 0){ //148 hexagone par ligne //si le numero de ligne est pair (en commencant par 0)
        numHexaHG = posAnimal-149;
        numHexaHD = posAnimal-148;
        numHexaG = posAnimal-1;
        numHexaD = posAnimal+1;
        numHexaBG = posAnimal+147;
        numHexaBD = posAnimal+148;
    }
    else {
        numHexaHG = posAnimal-148;
        numHexaHD = posAnimal-147;
        numHexaG = posAnimal-1;
        numHexaD = posAnimal+1;
        numHexaBG = posAnimal+148;
        numHexaBD = posAnimal+149;
    }

    var tableauProximite = [numHexaHG, numHexaHD, numHexaG, numHexaD, numHexaBG, numHexaBD];
    var terrain;
    for(var i in tableauProximite){
        terrain = carte[tableauProximite[i]]["type"];
        //terrain =  carte.getElement(tableauProximite[i])["type"];
        if (terrain == "chemin" || terrain == "spawn"){
            liste.push(tableauProximite[i]);
        }
    }
    return liste;
}

function calculDistance(posAnimal, posCible,carte){
    var resultat=Infinity;
    var hexaAnimal = carte[parseInt(posAnimal)];
    if (hexaAnimal){
        var posAnimalX = parseInt(hexaAnimal["x"]);
        var posAnimalY = parseInt(hexaAnimal["y"]);

        var hexaJoueur = carte[parseInt(posCible)];
        if (hexaJoueur){
            var posCibleX = parseInt(hexaJoueur["x"]);
            var posCibleY = parseInt(hexaJoueur["y"]);

            resultat = (posAnimalX-posCibleX)*(posAnimalX-posCibleX) + (posAnimalY-posCibleY)*(posAnimalY-posCibleY);
        }
    }
    return resultat;
}

function joueurPlusProche(players, animal,carte){ //serveur //a lier a animal.prototype
    //parcours tableaux joueur non allié
    //pour chaqu joueur calcul distance entre animal et joueur
    //prendre le min

    var min = -1;
    var test;
    var joueurMin;
    for(var i in players){

        if(animal.joueurAllie==null || animal.joueurAllie["nom"] != players[i].nom){
            test = calculDistance(animal.hexagone, players[i].hexagone,carte);
            if(test < min || min ==-1 ){

                min = test;
                joueurMin = i;
            }
        }
    }

    return joueurMin;
}

function chasse(animal,joueur,players,animaux,nbAnimal,carte){ // a ppeller a chaque unité de temps
    //liste = pathfinding(lion, lion.joueurPlusProche(), listevide);
    //pour chaque position de liste
    //deplacerAnimal()
    //attendre unmoment (1sec)
    console.log(animal.nom+" chasse "+ players[joueur].nom);

    var liste = pathfinding(animal.hexagone, players[joueur], carte, animal.hexagone);

   // console.log("taille chemin : "+ liste.length);
    //console.log("position de " +animal.nom+" : " + animal.hexagone);
    /*liste.forEach(function(hexa){
        console.log(hexa);
    });*/
    if(liste){
        animaux = DeplacementChemin(liste, animaux, nbAnimal);    
    }
    return animaux;
}

function DeplacementChemin(liste, animaux, indiceAnimal){ //attention a la recursion, ca bouclait a l'infini
    if(liste != undefined && liste.length>0){
        const vitesse = 4;
        var ite=0;
        var ordreHexa = parseInt(animaux[indiceAnimal].hexagone);

        do{
            ite=0;
            while (ite<vitesse && liste.length>0){
                ordreHexa = liste.shift();
                ite++;
            }
        }while (ordreHexa == parseInt(animaux[indiceAnimal].hexagone) && liste.length>0);

        animaux[indiceAnimal].hexagone = ordreHexa;
    }
    return animaux;
}

Object.defineProperty(Array.prototype, "supprimerIntervalle", {
    value:function(debut, fin){
        this.splice(debut, fin-debut+1);
    },
    enumerable:false
});

function pathfinding(posAnimal, posJoueur, carte) {
    // Variable "globale" à la fonction (0 : Indique qu'aucun chemin n'a encore été trouvé)
    var tailleCheminMinimalCourrant = 0;

    // Fonction interne implémentant pathfinding
    function intern(posAnimal, posJoueur, cheminCourant, carte) {
        //console.log("appel a pathfinding");
        // Cherche un chemin
        if (parseInt(posAnimal) == posJoueur.hexagone) {
            if (!tailleCheminMinimalCourrant || cheminCourant.length < tailleCheminMinimalCourrant) {
                // On n'avait pas de chemin ou on a trouvé un nouveau plus court!
                tailleCheminMinimalCourrant = cheminCourant.length;
            } else {
                //  Empeche l'appel récursif avec un chemin plus long
                cheminCourant = null;
            }
            return cheminCourant;
        }
        else {
            // On collecte les cases adjacentes qui sont éligibles au déplacement
            var listeHexaEligibles = listeHexaEligible(parseInt(posAnimal),carte);
            var listeHexaAvecDistances = [];

            // On crée une nouvelle liste contenant en plus les distances
            listeHexaEligibles.forEach(function(hexa) {
                listeHexaAvecDistances.push({
                    hexa : hexa,
                    distance : calculDistance(hexa, posJoueur.hexagone, carte)
                });
            });

            // On trie selon la distance
            listeHexaAvecDistances.sort(function(a, b) { return a.distance - b.distance; });

            var tailleMaxAtteinte =false;
            var ensembleChemins = [];
            listeHexaAvecDistances.forEach(function(hexaEligibleAvecDistance) {
                // On itère dans l'ordre croissant (chemin plus court à vol d'oiseau en premier)
                var hexaEligible = hexaEligibleAvecDistance.hexa;  // On récupère l'hexagone

                // Empêche de passer deux fois par la même case
                if(cheminCourant.indexOf(hexaEligible) === -1) {
                    // On fait une copie du chemin courrant et on y concatène le nouvel hexagone
                    var copieCheminCourant = [];
                    cheminCourant.forEach(function(hexagone){
                        copieCheminCourant.push(hexagone);
                    });
                    copieCheminCourant.push(hexaEligible);

                    // Verifie si on a déjà un chemin, sinon vérifie qu'on ne génère pas quelque chose de plus grand
                    if (!tailleCheminMinimalCourrant
                        || (tailleCheminMinimalCourrant && (copieCheminCourant.length < tailleCheminMinimalCourrant))) {
                        if (copieCheminCourant.length<60){
                            var sousChemin = intern(hexaEligible, posJoueur, copieCheminCourant, carte);

                        }
                        else {
                            sousChemin=copieCheminCourant;
                            tailleMaxAtteinte = true;
                        }

                        // On test si le chemin mène quelque part, sinon la fonction renvoie null
                        if(sousChemin) {
                            ensembleChemins.push(sousChemin);
                        }
                    }
                }
            });

            // On détermine le plus petit chemin en nombre de case
            // ou le plus proche en distance
            var resultat=null;
            if (tailleMaxAtteinte == true){
                var distanceFinCibleMin;
                ensembleChemins.forEach(function(sousCheminCoupe){
                    var dernierElement = sousCheminCoupe[(sousCheminCoupe.length)-1];
                    var distanceDernierCible = calculDistance(dernierElement, posJoueur.hexagone, carte);
                    if (!resultat){
                        resultat = sousCheminCoupe;
                        distanceFinCibleMin = distanceDernierCible;
                    }
                    else{
                        if(distanceDernierCible < distanceFinCibleMin){
                            resultat=sousCheminCoupe;
                            distanceFinCibleMin = distanceDernierCible;
                        }
                    }
                });
            }
            else {
                var tailleCheminMin;
                ensembleChemins.forEach(function(sousChemin){
                    if (!resultat){
                        resultat = sousChemin;
                        tailleCheminMin=sousChemin.length;
                    }
                    else{
                        if(sousChemin.length<tailleCheminMin){
                            resultat=sousChemin;
                            tailleCheminMin=sousChemin.length;
                        }
                    }
                });
            }


            return resultat;
        }
    }

    // Appel à la fonction interne avec un chemin nitialisé à "vide"
    return intern(posAnimal, posJoueur, [], carte);
}

module.exports = {
    Animal: function(n,no){
        return new Animal(n,no);
    },

    Joueur: function(n,i){
        return new Joueur(n,i);
    },
    chasseAnimaux: function(players,animaux,carte){
        var joueur;
        for(var i in animaux){
            if(animaux[i].libre == 1){
                joueur = joueurPlusProche(players,animaux[i],carte);
                animaux = chasse(animaux[i],joueur,players,animaux,i,carte);
            }
        }

        return animaux;
    }
};
