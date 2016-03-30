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
    this.loyauteJoueurPrincipal = 0;
    this.loyauteJoueur0 = 0;
    this.loyauteJoueur1 = 0; //pas dynamique du tout, obligé d'avoir 3 joueurs -> à voir en version dyna

}
Animal.prototype.definirJoueurAllie = function(){
    if(this.loyauteJoueurPrincipal > this.loyauteJoueur0 && this.loyauteJoueurPrincipal > this.loyauteJoueur1){
        this.joueurAllie = joueurPrincipal;
    }
    else if (this.loyauteJoueur0 > this.loyauteJoueurPrincipal && this.loyauteJoueur0 > this.loyauteJoueur1) {
        this.joueurAllie = joueurs[0];
    }
    else {
        this.joueurAllie = joueurs[1];
    }
};
Animal.prototype.nourriPar = function(joueur){
    if (this.loyaute<this.loyauteMax){
        this.loyaute+=1;

        if (joueur == joueurPrincipal){
            this.loyauteJoueurPrincipal ++;
        }
        if (joueur == joueurs[0]){
            this.loyauteJoueur0 ++;
        }
        if (joueur == joueurs[1]){
            this.loyauteJoueur1 ++;
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
        console.log("impossible de prendre davantage de nourriture");
    }
};
Joueur.prototype.nourrir = function(animal){
    if (this.nourriture == animal.alimentation){
        animal.nourriPar(this);
        this.nourriture = "";
    }
    else {
        console.log("impossible de nourrir "+animal.nom);
    }
};

//FONCTIONS POUR COMMUNICATION SERVEUR
function creerJoueurPrincipal(nom, avatar){
    return new Joueur(nom, avatar);
}
function ajouterAutreJoueur(nom, avatar){
    joueurs.push(new Joueur(nom, avatar));
}

//TESTS
var lion = new Animal('lion', "viande");
var loup = new Animal('loup', "viande");
var guepard = new Animal('guepard', "viande");
var ours = new Animal('ours', "poisson");
var animaux = [lion, loup, guepard, ours];

var joueurs = [];
var joueurPrincipal = creerJoueurPrincipal('sora', 'fille1');

joueurPrincipal.nourrir(guepard);
joueurPrincipal.prendreNourriture("viande");
while (lion.loyaute<lion.loyauteMax){
    joueurPrincipal.prendreNourriture("viande");
    joueurPrincipal.nourrir(lion);
}

joueurPrincipal.prendreNourriture("viande");
joueurPrincipal.nourrir(guepard);

ajouterAutreJoueur('roxas', 'garcon2');
while (ours.loyaute<ours.loyauteMax){
    joueurs[0].prendreNourriture("poisson");
    joueurs[0].nourrir(ours);
}
ajouterAutreJoueur('cloud', 'garcon1');


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
console.log(loup.joueurAllie.nom);

joueurPrincipal.prendreNourriture("poisson");

