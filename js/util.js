//Fonction quand on passe la souris sur une case
function mover(d) {
    var el = d3.select(this)
        .transition()
        .duration(10)         
        .style("fill-opacity", 0.5);
}

//Fonction lorsque la souris sort de la case
function mout(d) { 
    var el = d3.select(this);
    if(el.classed("hexagon") == true  && el.classed("mur") == true){
        el.transition()
        .duration(10)
        .style("fill-opacity", 0);    
    }
};

function loadMap(width, height, MapRows, element, callback){
	

    // ========================================
    //          initialisation de la grille
    // ========================================

    //The number of columns and rows of the heatmap

    var coef = width / height;
    var MapColumns = MapRows * coef;
        
    //The maximum radius the hexagons can have to still fit the screen
    var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
                height/((MapRows + 1/3) * 1.5)]);

    //Set the new height and width of the SVG based on the max possible
    width = MapColumns*hexRadius*Math.sqrt(3);
    heigth = MapRows*1.5*hexRadius+0.5*hexRadius;

    //Set the hexagon radius
    var hexbin = d3.hexbin()
                   .radius(hexRadius); 

    $.ajax({
        url: "http://localhost:5000/server/getMap",
        async: true
        }).done(function(donnee) {
            if(donnee != "null"){
                map=donnee;

                //Calculate the center positions of each hexagon
			    var points = [];
			    for (var i = 0; i < MapRows; i++) {
			        for (var j = 0; j < MapColumns; j++) {
			            points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
			        }
			    }


			    //Create SVG element
				var iscallback = (typeof callback !== "undefined");
				var svg;
				if (iscallback) {
					var svg_tag = document.createElement("svg");
					svg = d3.select(svg_tag)
						.attr("xmlns", "http://www.w3.org/2000/svg")
						.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
						.attr("width", width)
						.attr("height", height)
						.append("g");

				}
				else {
					svg = d3.select(".map").append("svg")
						.attr("xmlns", "http://www.w3.org/2000/svg")
						.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
						.attr("width", width)
						.attr("height", height)
						.append("g");
				}


			    /*
			    // Marche pas :(
			    svg.append("image")
			    .attr("x", 0)
			    .attr("y", 0)
			    .attr("xlink:href", "../img/map_zoo.png")
			    .attr("width","1000px")
			    .attr("height","650px");
			    */


			    //Génère les hexagon de base
			    svg.selectAll(".hexagon")
			        .data(hexbin(points))
			        .enter().append("path")
			        .attr("class", "hexagon")
			        .attr("d", function (d) {
			            return "M" + d.x + "," + d.y + hexbin.hexagon();
			        })
			        .attr("stroke", function (d,i) {
			            return "#000";
			        })
			        .attr("stroke-width", "1px")
			        .classed(element, true)
			        .on("mouseover", mover)
			        .on("mouseout", mout)
			        .style("fill-opacity", 0)
			        .on("click", gridClick);

			    //Génère la map chargée
			    d3.selectAll(".hexagon")
			      .data(map)
			      .each(function(data){
			        if(data.type != element){
			            this.setAttribute("class","hexagon " + data.type);
			            $(this).css("fill-opacity", 0.5);
			            $(this).css("fill",data.color);
			        }
			      })

				if (iscallback){
					callback(svg_tag.outerHTML);
				}
			}
			else{
			   	alert("Il y a eu une erreur");
			}
        })
        .fail(function(){
        	alert("Il y a eu une erreur avec le serveur, il est peut être déconnecté");
        });
};