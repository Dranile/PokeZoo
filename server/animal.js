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

module.exports = Animal;