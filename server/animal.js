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
    this.loyauteMax = 5;
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

/*Joueur.prototype.getPosX = function(){
    return this.positionX;
};

Joueur.prototype.getPosY = function(){
    return this.positionY;
};*/

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





//Animal.prototype.listeHexaEligible = function() {
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
        if (terrain == "chemin"){
            liste.push(tableauProximite[i]);
        }
    }
    return liste;
}

function calculDistance(posAnimal, posCible,carte){
    /*
    var hexaAnimal = document.querySelector("[ordreHexagone='"+posAnimal+"'");
    var posAnimalX = parseInt(hexaAnimal.getAttribute("x"));
    var posAnimalY = parseInt(hexaAnimal.getAttribute("y"));
    var hexaJoueur = document.querySelector("[ordreHexagone='"+posCible+"'");
    var posCibleX = parseInt(hexaJoueur.getAttribute("x"));
    var posCibleY = parseInt(hexaJoueur.getAttribute("y"));

    var distance = (posAnimalX-posCibleX)*(posAnimalX-posCibleX) + (posAnimalY-posCibleY)*(posAnimalY-posCibleY);
    return distance;
    */
    // console.log(carte[parseInt(posAnimal)]);
    var hexaAnimal = carte[parseInt(posAnimal)];
    var posAnimalX = parseInt(hexaAnimal["x"]);
    var posAnimalY = parseInt(hexaAnimal["y"]);

    var hexaJoueur = carte[parseInt(posCible)];
    var posCibleX = parseInt(hexaJoueur["x"]);
    var posCibleY = parseInt(hexaJoueur["y"]);

    

    var distance = (posAnimalX-posCibleX)*(posAnimalX-posCibleX) + (posAnimalY-posCibleY)*(posAnimalY-posCibleY);
    return distance;
}

function HexgoneEligibleDistance(hexagone){
    this.hexagone = hexagone;
    this.distance = 0;
    this.nbPassage = 0;

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

            console.log("player : "+ i);
            console.log(players[i]);
            test = calculDistance(animal.hexagone, players[i].hexagone,carte);
            console.log("test : "+test);
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
            var liste = pathfinding(animal.hexagone, players[joueur], listevide,carte);
               
    animaux = DeplacementChemin(liste,animal,animaux,nbAnimal);

    return animaux;
    
}

 
function DeplacementChemin(liste,animal,animaux,nbAnimal){ //attention a la recursion, ca bouclait a l'infini
    console.log(liste);

    if(liste != undefined ){
        if ( liste.length>0){ //la verif cest ici sinon la console gueule sans s'arreter ^^
            var ordreHexa = liste.shift();

            animaux[nbAnimal].hexagone = ordreHexa.hexagone;
            console.log("Ordre hexa deplacement chemin :" +ordreHexa.hexagone);
                
        }
    }
    return animaux;
}


//ATTENTION SI JOUEUR NEXISTE PLUS
function pathfinding(animal, joueur, listePasPrecedents,carte){

    if (parseInt(animal) == joueur.hexagone){
        return listePasPrecedents;
    }
    else {
        var liste = listeHexaEligible(parseInt(animal),carte); //liste d'entier
        var listeDistance = [];

        for (var i in liste){
            listeDistance.push(new HexgoneEligibleDistance(liste[i]));
        }
        for (var g in listeDistance){
            for(var t in listePasPrecedents){
                if(listeDistance[g].hexagone == listePasPrecedents[t].hexagone) {
                    listeDistance[g].nbPassage = listePasPrecedents[t].nbPassage;
                }
            }
        }

        var listeDistanceFinale = [];
        for (var h in listeDistance){
            //if (listeDistance[h].nbPassage < 3) {
            if (listeDistance[h].nbPassage < 2) {
                listeDistanceFinale.push(listeDistance[h]);
            }
        }
        for (var hf in listeDistanceFinale) {
            listeDistanceFinale[hf].nbPassage++;
            listeDistanceFinale[hf].distance = calculDistance(listeDistanceFinale[hf].hexagone, joueur.hexagone,carte);
        }

        listeDistanceFinale.sort(function(a,b){
            if(a.distance > b.distance){
                return 1;
            }
            if(a.distance < b.distance){
                return -1;
            }
            return 0;
        });
        for (var j in listeDistanceFinale){
            listePasPrecedents.push(listeDistanceFinale[j]);
            return pathfinding(listeDistanceFinale[j].hexagone, joueur, listePasPrecedents,carte);
        }
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
                console.log(animaux[i]);
                joueur = joueurPlusProche(players,animaux[i],carte);
                animaux = chasse(animaux[i],joueur,players,animaux,i,carte);
            }
        }

        return animaux;
    }
};