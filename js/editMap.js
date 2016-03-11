/* ===============================================
 *                  Variables / constantes
 * ================================================
*/
var color = ""; //élément par défaut
var element = "mur"; //élément par défaut
var array = []; // tableau d'obj, permet la sauvegarde de la grille
var dataSelect; // Variable du sélecteur
// constantes pour la grille
var width = 6400;
var height = 3224;
var MapRows = 50;
//constantes concernant le déplacement de la carte
var x = 0, y = 0;
var pas  = 30;



/* ===========================================
 *          fonction event grille
 * ===========================================
 */

//Fonction quand on clique sur une case
function gridClick(d){
    if(color == ""){
        var el = d3.select(this)
            .attr("class", "")
            .classed("hexagon", true)
            .classed("mur", true)
            .style("fill", color);
    }
    else{        
        var el = d3.select(this)
            .classed("mur", false)
            .classed(element,true)
            .style("fill", color);
    }
}   

function moveX(elem, x, y, pas){
    elem.style("background-position", (x += pas) + "px " + y + "px");
    elem.select("g")
      .attr("transform", "translate(" + x +","+ y +")");
    return x;
}

function moveY(elem, x, y, pas){
    elem.style("background-position",x + "px " + (y += pas) + "px");
    elem.select("g")
      .attr("transform", "translate(" + x +","+ y +")");
    return y;
}

$().ready(function(){

// ===========================================
//              initialisation selecteurs
// ============================================

        $.ajax({
        url: "http://localhost:5000/server/getType",
        async: true
        }).done(function(d) {
            if(d == "null"){
                console.log("test");
                alert("Le serveur semble déconnecté ou a eu une erreur");
                return;
            }
            else{
                dataSelect = d;
                var el = d3.select(".menu").selectAll("li")
                   .data(dataSelect)
                   .enter().append("li")
                   .append("label")
                   .attr("for", function(d){
                        return d.type;
                    })
                   .text(function(d){
                        return d.type;
                    })
                   .append("input")
                   .attr("type", "radio")
                   .attr("id", function(d){
                        return d.type;
                    })
                   .attr("name","terrain")
                   .on("click", function(d){
                        color = d.couleur;
                        element = d.element;
                    });

                var el = d3.select(".menu li input:first-child")
                           .attr("checked", "true");

                loadMap(width, height, MapRows, element);
            }
        })
        .fail(function(){
            alert("Le serveur semble déconnecté ou a eu une erreur");
            return;
        });
        

    /* =======================================================
     *                  Event déplacement sur la carte
     * =======================================================
      */

    document.addEventListener("keydown", function(event){
        var elem = d3.select("div.map");
        if(event.keyCode == 37 && x < 0){ // à gauche
            x = moveX(elem, x , y, pas);
        }
        if(event.keyCode == 38 && y < 0){ // en haut
            y = moveY(elem,x, y, pas);
        }
        if(event.keyCode == 39 && x>(-6400 + 1000)){ // à droite
            x = moveX(elem, x,y, -pas);
        }
        if(event.keyCode == 40 && y>(-3225 + 650)){ // en bas
            y = moveY(elem, x, y, -pas);
        }
    });

    /* =====================================================
     *                  Fonctions sauvegarde et annuler
     * =====================================================
    */

    d3.select("input#save")
      .on("click", function(){
            array = [];
            elem = d3.selectAll("div.map g path");
            elem.each(function(d){
                console.log(d); //Pour obtenir le x, y
                var classe = this.getAttribute("class");
                classe = classe.substring(8);
                //console.log(classe); //pour obtenir la classe
                var obj = {
                    "type":classe,
                    "color":this.style.fill
                };
                array.push(obj);
            });
            console.log(array);
            //Récupérer la liste des sélécteurs, et le sauvegarder
            var map = JSON.stringify(array);
            $.ajax({
               method: "POST",
               url: "http://localhost:5000/server/setMap",
               'Content-Type': 'application/json',
               data: {data : map }
            }).done(function( msg ) {
                console.log( "Contrôle : " + msg );
            })
            .fail(function(){
                console.log("l'envoi de donnée a fail");
            });
       });

    d3.select("input#cancel")
      .on("click", function(){
        //rafraichit la page, plus tard on pourrais juste refaire les appels ajax...
        window.location.reload();
      });
});

