// Define the size and position of indicator
var total_width = 150;
var total_height = 17;
var radius = total_height/2;

function draw() {
    var element = "mur"; //élément par défaut
    var width = 6400;
    var height = 3224;
    var rayon = 25;

    loadMap(width, height, rayon,element);
    //redessiner a la fin dun tour
}

function dessiner(joueurPrincipal){
    const largeur = document.documentElement.clientWidth;
    const hauteur = document.documentElement.clientHeight;

    var canvas = document.getElementById("plateau");
    canvas.width = largeur;
    canvas.height = hauteur;

    var context = canvas.getContext("2d"); //dis que je veux bosser sur le truc "plateau"

    // ENIGME
    context.fillStyle = "rgb(70,161,181)";
    context.fillRect(0.8*largeur, 0, 0.2*largeur, hauteur);
    context.fillStyle = "rgb(255,255,255)";
    context.font = "30px Arial";
    context.fillText("Enigme", 0.87*largeur, 30);
    context.font = "15px Arial";
    context.fillText(enigme, 0.81*largeur, 60);

    // COLONNE DES ANIMAUX (image + barre de loyauté)
    context.fillStyle = "rgb(70,161,181)";
    context.fillRect(0, 0, 0.2*largeur, hauteur);

    context.fillStyle = "rgb(0,0,0)";
    var tailleAnimaux = 0.12*hauteur;
    animaux.forEach(function(animal, index) {
        var image = new Image();
        image.src = ('/media/img/'+animal.nom+'.png');
        image.onload = function () {
            context.drawImage(image, 0, (index)*(0.14*hauteur), tailleAnimaux, tailleAnimaux);
        };

        var i = (animal.loyaute / animal.loyauteMax) * total_width;

        progressLayerRect(context, tailleAnimaux+20, (index)*(0.14*hauteur)+tailleAnimaux/2, total_width, total_height, radius);
        if (animal.loyaute < animal.loyauteMax){
            progressBarColore(context, tailleAnimaux+20, (index)*(0.14*hauteur)+tailleAnimaux/2, i, total_height, radius, total_width, "rgb(21,48,53)");
        }
        else if (animal.joueurAllie["nom"] == joueurPrincipal["nom"]) {
            progressBarColore(context, tailleAnimaux+20, (index)*(0.14*hauteur)+tailleAnimaux/2, i, total_height, radius, total_width, "rgb(65,150,54)");
        }
        else {
            progressBarColore(context, tailleAnimaux+20, (index)*(0.14*hauteur)+tailleAnimaux/2, i, total_height, radius, total_width, "rgb(150,28,21)");
        }
        progressText(context, tailleAnimaux+20, (index)*(0.14*hauteur)+tailleAnimaux/2, i, total_height, radius, total_width);
    });

    // IMAGE DU DRESSEUR
    context.fillStyle = "rgb(51,116,130)";
    context.fillRect(0, 0.6*hauteur, 0.2*largeur, 0.4*hauteur);
    var tailleDresseur = 0.20*hauteur;
    var dresseur = new Image();
    dresseur.src = ('/media/img/'+joueurPrincipal.image);
    dresseur.onload = function () {
        context.drawImage(dresseur, 0, 0.65*hauteur, tailleDresseur, (280/180)*tailleDresseur);
        context.fillStyle = "rgb(255,255,255)";
        context.font = "30px Arial";
        context.fillText(joueurPrincipal.nom, 0.12*largeur, 0.70*hauteur);
        context.fillText(joueurPrincipal.nourriture, 0.12*largeur, 0.80*hauteur)
    };


    // ESPACE DES ACTIONS
    context.fillStyle = "rgb(116,179,193)";
    context.fillRect(0.2*largeur, 0.8*hauteur, 0.6*largeur, 0.2*hauteur);

    var compteur = 0;
    var hauteurTexte = 0.85*hauteur;
    $.ajax({
        url: "/server/getType",
        async: true
    }).done(function(d) {
        if(d == "null"){
            console.log("test");
            alert(" Le serveur semble déconnecté ou a eu une erreur :\nProblème de chargement des données");
        }
        else{
            dataSelect = d;
            dataSelect.forEach(function(d, indexLegende) {
                var debutTexte = (0.21*largeur)+(indexLegende*(0.08*largeur));
                if (/^Cage.*/.test(d.type)) {
                    hauteurTexte = 0.90 * hauteur;
                    debutTexte = (0.21*largeur)+((indexLegende-compteur-1)*(0.08*largeur));
                } else if (d.type == "Viande") {
                    hauteurTexte = 0.95 * hauteur;
                    debutTexte = (0.21*largeur);
                }
                else {
                    compteur = indexLegende;
                }
                context.fillStyle = d.couleur;
                context.fillRect(debutTexte+5, hauteurTexte, 15, 15);
                context.fillStyle = "rgb(255,255,255)";
                context.font = "15px Arial";
                context.fillText(d.type, debutTexte, hauteurTexte-4);
            });
        }
    })
    .fail(function(){
        alert("Le serveur semble déconnecté ou a eu une erreur :\nImpossible de charger les données");
    });
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arc(x+width-radius, y+radius, radius, -Math.PI/2, Math.PI/2, false);
    ctx.lineTo(x + radius, y + height);
    ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    ctx.closePath();
    ctx.fill();
}
function progressLayerRect(ctx, x, y, width, height, radius) {
    ctx.save();
    // Define the shadows
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#666';

    // first grey layer
    ctx.fillStyle = 'rgba(189,189,189,1)';
    roundRect(ctx, x, y, width, height, radius);

    // second layer with gradient
    // remove the shadow
    ctx.shadowColor = 'rgba(0,0,0,0)';
    var lingrad = ctx.createLinearGradient(0,y+height,0,0);
    lingrad.addColorStop(0, 'rgba(255,255,255, 0.1)');
    lingrad.addColorStop(0.4, 'rgba(255,255,255, 0.7)');
    lingrad.addColorStop(1, 'rgba(255,255,255,0.4)');
    ctx.fillStyle = lingrad;
    roundRect(ctx, x, y, width, height, radius);

    ctx.restore();
}
function progressBarColore(ctx, x, y, width, height, radius, max, couleur){
    ctx.fillStyle = couleur;
    progressBarRect(ctx, x, y, width, height, radius, max);
}
function progressBarRect(ctx, x, y, width, height, radius, max) {
    // deplacement for chord drawing
    var offset = 0;
    ctx.beginPath();
    if (width<radius) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius-width),2));
        // Left angle
        var left_angle = Math.acos((radius - width) / radius);
        ctx.moveTo(x + width, y+offset);
        ctx.lineTo(x + width, y+height-offset);
        ctx.arc(x + radius, y + radius, radius, Math.PI - left_angle, Math.PI + left_angle, false);
    }
    else if (width+radius>max) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius - (max-width)),2));
        // Right angle
        var right_angle = Math.acos((radius - (max-width)) / radius);
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.arc(x+max-radius, y + radius, radius, -Math.PI/2, -right_angle, false);
        ctx.lineTo(x + width, y+height-offset);
        ctx.arc(x+max-radius, y + radius, radius, right_angle, Math.PI/2, false);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    }
    else {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    }
    ctx.closePath();
    ctx.fill();

    // shadow on the right
    if (width<max-1) {
        ctx.save();
        ctx.shadowOffsetX = 1;
        ctx.shadowBlur = 1;
        ctx.shadowColor = '#666';
        if (width+radius>max)
            offset = offset+1;
        ctx.fillRect(x+width,y+offset,1,total_height-offset*2);
        ctx.restore();
    }
}
function progressText(ctx, x, y, width, height, radius, max) {
    ctx.save();
    ctx.fillStyle = 'white';
    var text = Math.floor(width/max*100)+"%";
    var text_width = ctx.measureText(text).width;
    var text_x = x+width-text_width-radius/2;
    if (width<=radius+text_width) {
        text_x = x+radius/2;
    }
    ctx.fillText(text, text_x, y+22);
    ctx.restore();
}

function redessiner(){
    dessiner(joueurP);
}