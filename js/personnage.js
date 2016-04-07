var joueurs = [];

function Personnage(nom){
    this.nom = nom;
    this.initiative = 0;
    this.deplacement =  0;
    this.positionX = 0;
    this.positionY = 0;
}
Personnage.prototype.deplacer = function(posX, posY) {
    this.positionX = posX;
    this.positionY = posY;
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

        if(joueurPrincipal.nom == nouvelAllie){
            this.joueurAllie = joueurPrincipal;
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

// JOUEURS
function Joueur(nom, image){
    Personnage.call(this, nom);
    this.image = image+'.png';
    this.nourriture = "";
    this.animaux = [];
}
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
        animal.nourriPar(this);
        this.nourriture = "";
    }
    else {
        alert("impossible de nourrir "+animal.nom);
    }
};

//FONCTIONS POUR COMMUNICATION SERVEUR
function creerJoueurPrincipal(nom, avatar){
    return new Joueur(nom, avatar);
}
function ajouterAutreJoueur(nom, avatar){
    joueurs.push(new Joueur(nom, avatar));
}

var lion = new Animal('lion', "viande");
var loup = new Animal('loup', "viande");
var guepard = new Animal('guepard', "viande");
var ours = new Animal('ours', "poisson");
var animaux = [lion, loup, guepard, ours];

//TESTS

/*var joueurPrincipal = creerJoueurPrincipal('sora', 'fille1');
ajouterAutreJoueur('roxas', 'garcon2');
ajouterAutreJoueur('cloud', 'garcon1');


//joueurPrincipal.nourrir(guepard);
//joueurPrincipal.prendreNourriture("viande");
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

joueurPrincipal.prendreNourriture("poisson");*/

