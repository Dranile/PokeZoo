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
        if (terrain == "chemin" || terrain == "spawn"){
            liste.push(tableauProximite[i]);
        }
    }
    return liste;
}

function calculDistance(posAnimal, posCible,carte){
    var hexaAnimal = carte[parseInt(posAnimal)];
    var posAnimalX = parseInt(hexaAnimal["x"]);
    var posAnimalY = parseInt(hexaAnimal["y"]);

    var hexaJoueur = carte[parseInt(posCible)];
    var posCibleX = parseInt(hexaJoueur["x"]);
    var posCibleY = parseInt(hexaJoueur["y"]);

    return (posAnimalX-posCibleX)*(posAnimalX-posCibleX) + (posAnimalY-posCibleY)*(posAnimalY-posCibleY);
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

    var listevide = [];
    var liste = [];
    liste = pathfinding(animal.hexagone, players[joueur], listevide, carte, animal.hexagone);

    console.log("taille chemin : "+ liste.length + "       chemin : ");
    liste.forEach(function(hexa){
        console.log(hexa);
    });

    animaux = DeplacementChemin(liste,animal,animaux,nbAnimal);

    return animaux;
}

function DeplacementChemin(liste,animal,animaux,nbAnimal){ //attention a la recursion, ca bouclait a l'infini
    if(liste != undefined ){

        if (liste.length>0){ //la verif cest ici sinon la console gueule sans s'arreter ^^
            var ordreHexa = liste.shift();
             if (liste.length>0){
             ordreHexa = liste.shift();
             }
            animaux[nbAnimal].hexagone = ordreHexa;
        }
    }
    return animaux;
}

Object.defineProperty(Array.prototype, "supprimerIntervalle", {
    value:function(debut, fin){
        this.splice(debut, fin-debut+1);
    },
    enumerable:false
});

function pathfinding(posAnimal, posJoueur, cheminCourant, carte){
    if (parseInt(posAnimal) == posJoueur.hexagone){
        return cheminCourant;
    }
    else {
        var listeHexaEligibles = listeHexaEligible(parseInt(posAnimal),carte);

        var ensembleChemins = [];
        listeHexaEligibles.forEach(function(hexaEligible){
            if(cheminCourant.indexOf(hexaEligible) === -1){ //le lhexa n'est pas dans le chemin
                var copieCheminCourant = [];
                cheminCourant.forEach(function(hexagone){
                    copieCheminCourant.push(hexagone);
                });
                copieCheminCourant.push(hexaEligible);

                var sousChemin = pathfinding(hexaEligible, posJoueur, copieCheminCourant, carte);
                if(sousChemin){
                    ensembleChemins.push(sousChemin);
                }
            }
        });

        var tailleCheminMin;
        var resultat=null;
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

        return resultat;
    }
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