function personnage(nom){
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
function animal(nom, nourriture){
    personnage.call(this, nom);
    this.nourriture = nourriture;
    this.loyaute = 0;
    this.loyauteMax = 5;
    this.joueurAllie = null;
}
animal.prototype = new personnage();
animal.prototype.nourri = function(){
    this.loyaute+=1;
};


// JOUEURS
function joueur(nom, image){
    personnage.call(this, nom);
    this.image = image+'.png';
    this.nourriture = "";
}
joueur.prototype = new personnage();
joueur.prototype.nourrir = function(animal, nourriture){
    if (nourriture == animal.nourriture){
        animal.nourri();
    }
};


var lion = new animal('lion', "viande");
var loup = new animal('loup', "viande");
var guepard = new animal('guepard', "viande");
var ours = new animal('ours', "poisson");
lion.loyaute = 3;

var animaux = [lion, loup, guepard, ours];


var joueur1 = new joueur('Sora', 'fille2');
joueur1.nourrir(lion, "viande");
joueur1.nourrir(guepard, "viande");
joueur1.nourrir(guepard, "viande");