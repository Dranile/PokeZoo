var joueurs = [];
var joueurPrincipal;
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

}
Animal.prototype.definirJoueurAllie = function(){
    var max = 0;
    var nouvelAllie;
    for (allie in this.niveau) {
        if (this.niveau[allie] > max){
            max = this.niveau[allie];
            nouvelAllie = allie;

        }

        if(joueurP.nom == nouvelAllie){
            this.joueurAllie = joueurP;
        }
        else {
            for (var j in joueurs){
                //console.log(j);
                if(joueurs[j].nom == nouvelAllie){
                    this.joueurAllie = joueurs[j];
                }
            }
        }
    }
};
Animal.prototype.nourriPar = function(joueur){
    if (this.loyaute<this.loyauteMax){
        this.loyaute+=1;

        if (joueur.nom in this.niveau){
            this.niveau[joueur.nom] += 1 ;
        }
        else {
            this.niveau[joueur.nom] = 1 ;
        }

        if (this.loyaute == this.loyauteMax) {
            this.definirJoueurAllie();
            this.joueurAllie.animaux.push(this);
        }
    }
};
Animal.prototype.update = function(animal){
    if (animal.nom == this.nom) {
        this.positionX = animal.positionX;
        this.positionY = animal.positionY;
        this.hexagone = animal.hexagone;
        this.loyaute = animal.loyaute;
        this.joueurAllie = animal.joueurAllie;
        this.niveau = animal.niveau;
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
        alert("impossible de prendre davantage de nourriture");
    }
};
Joueur.prototype.nourrir = function(animal){
    if (this.nourriture == animal.alimentation){
        //animal.nourriPar(this);
        this.nourriture = "";
        nourrirServeur(this, animal);
    }
    else {
        alert("impossible de nourrir "+animal.nom);
    }
};
Joueur.prototype.update = function(joueur){
    this.UpdateDeplacer(joueur.hexagone);
    this.animaux = joueur.animaux;
};

//Animal.prototype.listeHexaEligible = function() {
/*function listeHexaEligible(position) { //mis sur joueur pour test vu que aucun animal initialisé
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
        terrain = document.querySelector("[ordre='"+tableauProximite[i]+"'").getAttribute("class").split(" ")[1];
        if (terrain == "chemin"){
            liste.push(tableauProximite[i]);
        }
    }
    return liste;
}

function calculDistance(posAnimal, posCible){
    var hexaAnimal = document.querySelector("[ordre='"+posAnimal+"'");
    var posAnimalX = parseInt(hexaAnimal.getAttribute("x"));
    var posAnimalY = parseInt(hexaAnimal.getAttribute("y"));
    var hexaJoueur = document.querySelector("[ordre='"+posCible+"'");
    var posCibleX = parseInt(hexaJoueur.getAttribute("x"));
    var posCibleY = parseInt(hexaJoueur.getAttribute("y"));

    var distance = (posAnimalX-posCibleX)*(posAnimalX-posCibleX) + (posAnimalY-posCibleY)*(posAnimalY-posCibleY);
    return distance;
}

/*function HexgoneEligibleDistance(hexagone){
    this.hexagone = hexagone;
    this.distance = 0;
    this.nbPassage = 0;

}

/*function joueurPlusProche(){ //serveur //a lier a animal.prototype
    //parcours tableaux joueur non allié
    //pour chaqu joueur calcul distance entre animal et joueur
    //prendre le min
    for(var i in players){

        
    }

    return true;
}

/*function chasse(animal){ // a ppeller a chaque unité de temps
    //liste = pathfinding(lion, lion.joueurPlusProche(), listevide);
    //pour chaque position de liste
        //deplacerAnimal()
        //attendre unmoment (1sec)

    var listevide = [];
            var liste = pathfinding(animal.hexagone, joueurP, listevide);
               
    clearTimeout(tidDep);
    tidDep = setTimeout(DeplacementChemin,1000,liste,animal);
    tidCha = setTimeout(chasse,2005,animal);
}

    

//ATTENTION SI JOUEUR NEXISTE PLUS
/*function pathfinding(animal, joueur, listePasPrecedents){
    if (parseInt(animal) == joueur.hexagone){
        return listePasPrecedents;
    }
    else {
        var liste = listeHexaEligible(parseInt(animal)); //liste d'entier
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
            listeDistanceFinale[hf].distance = calculDistance(listeDistanceFinale[hf].hexagone, joueur.hexagone);
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
            return pathfinding(listeDistanceFinale[j].hexagone, joueur, listePasPrecedents);
        }
    }
}*/

//FONCTIONS POUR COMMUNICATION SERVEUR
function creerJoueurPrincipal(nom, avatar){
    return new Joueur(nom, avatar);
}
function ajouterAutreJoueur(nom, avatar){
    joueurs.push(new Joueur(nom, avatar));
}

//INITIALISATION ANIMAUX
var lion = new Animal('lion', "viande");
var loup = new Animal('loup', "viande");
var guepard = new Animal('guepard', "viande");
var ours = new Animal('ours', "poisson");
var animaux = [lion, loup, guepard, ours];


//TESTS
/*
joueurPrincipal = creerJoueurPrincipal('sora', 'fille1');

ajouterAutreJoueur('roxas', 'garcon2');
ajouterAutreJoueur('cloud', 'garcon1');

joueurPrincipal.nourrir(guepard);
joueurPrincipal.prendreNourriture("viande");

while (lion.loyaute<lion.loyauteMax){
    joueurPrincipal.prendreNourriture("viande");
    joueurPrincipal.nourrir(lion);
}

joueurPrincipal.prendreNourriture("viande");
joueurPrincipal.nourrir(guepard);

while (ours.loyaute<ours.loyauteMax){
    joueurs[0].prendreNourriture("poisson");
    joueurs[0].nourrir(ours);
}

joueurs[1].prendreNourriture("viande");
joueurs[1].nourrir(loup);
joueurs[1].prendreNourriture("viande");
joueurs[1].nourrir(loup);
joueurs[1].prendreNourriture("viande");
joueurs[1].nourrir(loup);

joueurPrincipal.prendreNourriture("viande");
joueurPrincipal.nourrir(loup);
joueurPrincipal.prendreNourriture("viande");
joueurPrincipal.nourrir(loup);

//debugger;

joueurPrincipal.prendreNourriture("poisson");
*/