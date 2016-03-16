function Personnage(nom){
    this.nom = nom;
    this.initiative = 0;
    this.deplacement =  0;
    this.posX = 0;
    this.posY = 0;
}
/*personnage.prototype.deplacement() = function() {
    console.log("je me deplace");
}*/

// ANIMAUX
function Animal(nom, nourriture){
    Personnage.call(this, nom);
    this.alimentation = nourriture;
    this.loyaute = 0;
    this.loyauteMax = 5;
    this.joueurAllie = null;
}
Animal.prototype.nourriPar = function(joueur){
    if (this.loyaute<this.loyauteMax){

    }
    this.loyaute+=1;
};



// JOUEURS
function Joueur(nom, image){
    Personnage.call(this, nom);
    this.image = image+'.png';
    this.nourriture = "";
}
Joueur.prototype.nourrir = function(animal, nourriture){
    if (nourriture == animal.alimentation){
        animal.nourriPar(this);
    }
};


var lion = new Animal('lion', "viande");
var loup = new Animal('loup', "viande");
var guepard = new Animal('guepard', "viande");
var ours = new Animal('ours', "poisson");

var animaux = [lion, loup, guepard, ours];


var joueur1 = new Joueur('Sora', 'fille2');
joueur1.nourrir(lion, "viande");
joueur1.nourrir(guepard, "viande");
joueur1.nourrir(guepard, "viande");