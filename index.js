d3.json("places.geojson", function(places) {
    d3.json("world.json", function(world) {
//    var e = event || window.event;
//    function getMousePos(event) {
//    
//    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
//    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
//    var x = e.pageX || e.clientX + scrollX;
//    var y = e.pageY || e.clientY + scrollY;
//    return { 'x': x, 'y': y };
//    }

    var projection = d3.geo.orthographic()
                           .scale(240)
                           .translate([300,260])
                           .clipAngle(90);
    var path = d3.geo.path().projection(projection);
    var color = d3.scale.category20();


    var pathStampede = d3.geo.path().projection(projection)
                                 .pointRadius(function(it) { 
//                                     console.log(magmap(parseFloat(it.properties.Killed)))
                                     return magmap(parseFloat(it.properties.Killed)); 
                                 });
    var countries = topojson.feature(world, world.objects.countries).features;

    var polygon = d3.select("#svg").selectAll("path")
                                   .data(countries)
                                   .enter()
                                   .append("path")
                                   .attr({
                                        "d":path,
                                        "stroke":function(){return "#1E202A";},
                                        "fill":function(d){return "#0B0D19";}
                                   })
                                    .style("stroke-width",0.5);

                    //				.attr("fill",function(d,i){
                    //					return color(i);
                    //				})
//                                    .on("mouseover",function(d,i){
//                                        d3.select(this)
//                                            .attr("fill","rgba(255,255,255,0.1)");
//                                    })
//                    //				.on("mouseout",function(d,i){
//                    //					d3.select(this)
//                    //						.attr("fill",color(i));
//                    //				})
//                                    .on("mouseout",function(d,i){
//                                        d3.select(this)
//                                            .attr("fill","#141414");
//                                    });
        

    d3.select("#svg").selectAll("g.stampedes")
                     .data(places.features)
                     .enter()
                     .append("g")
                     .attr("class", "stampedes");

    function magmap(it) {
//      return Math.pow(3.162, it) / 100;
        return Math.sqrt(it)/3;
    }
        
    var circleStampede = d3.select("#svg")
                           .selectAll("g.stampedes")
                           .append("path");

    var updateLocation = function() {
            circleStampede.style("stroke-width",0.5)
                          .attr({
                            d: pathStampede,
                            fill: function(it){
                                switch(it.properties.Type){
                                        case "Accident":
                                            return "rgba(108,25,121,0.2)";
                                            break;
                                        case "Religious":
                                            return "rgba(255,158,0,0.2)";
                                            break;
                                        case "Sport":
                                            return "rgba(46,97,212,0.2)";
                                            break;
                                        case "Cultural":
                                            return "rgba(163,125,89,0.2)";
                                            break;
                                        case "Terrorist":
                                            return "rgba(189,189,189,0.2)";
                                            break;
                                        case "Political":
                                            return "rgba(71,184,277,0.2)";
                                            break;
                                        case "Personal":
                                            return "rgba(79,201,102,0.2)";
                                            break;
                                        case "Entertainment":
                                            return "rgba(227,46,54,0.2)";
                                            break;
                                        default:
                                            return "rgba(228,60,82,0.2)";
                                       }
                                },
                            stroke: function(it){
                                switch(it.properties.Type){
                                        case "Accident":
                                            return "rgba(148,15,171,0.5)";
                                            break;
                                        case "Religious":
                                            return "rgba(255,158,0,0.5)";
                                            break;
                                        case "Sport":
                                            return "rgba(46,97,212,0.5)";
                                            break;
                                        case "Cultural":
                                            return "rgba(163,125,89,0.5)";
                                            break;
                                        case "Terrorist":
                                            return "rgba(189,189,189,0.5)";
                                            break;
                                        case "Political":
                                            return "rgba(71,184,277,0.5)";
                                            break;
                                        case "Personal":
                                            return "rgba(79,201,102,0.5)";
                                            break;
                                        case "Entertainment":
                                            return "rgba(227,46,54,0.5)";
                                            break;
                                        default:
                                            return "rgba(228,60,82,0.5)";
                                       }
                                }  
                        })
                        .on("mouseover", function(it) {

                            //Update the tooltip position and value
                            d3.select("#tooltip")
//                                .style("left",  getMousePos(e).x+"px")
//                                .style("top", getMousePos(e).y+"px")				
                                .style("left",  30+"%")
                                .style("top", 30+"%");
                            d3.select("#headline")
                                .text(it.properties.Time);
                            d3.select("#location")
                                 .text(it.properties.Subtype+" /   "+it.properties.Location+" , "+it.properties.City+" , "+it.properties.Country);   
                            d3.select("#death")
                                .text(it.properties.Killed)
//                                .style("color", "#E43C52")
                                .style("font-weight", "700");
                
                            d3.select("#injured")
                                .text(it.properties.Injured)
                                .style("font-weight", "700");
                            d3.select("#description")
                                .text(it.properties.Description);
                            d3.select("#cause")
                                .text(it.properties.Cause);

                            //Show the tooltip
                            d3.select("#tooltip").classed("hidden", false);

                       })
                       .on("mouseout", function() {

                            //Hide the tooltip
                            d3.select("#tooltips").remove();
                            d3.select("#tooltip").classed("hidden", true);

                       });
    };


    d3.select("#svg")
      .call(d3.behavior.drag()
                       .origin(function() {
                          r = projection.rotate();
                          return {x: r[0], y: -r[1]};
                        })
                        .on("drag", function() {
                            rotate = projection.rotate();
                            projection.rotate([d3.event.x, -d3.event.y, rotate[2]]);
                            d3.select("#svg").selectAll("path").attr("d", path);
                            updateLocation();
                        })
           )
        .call(d3.behavior.zoom()
                        .scaleExtent([1, 10])
					    .on("zoom", zoomed)
             ); 
        
       function zoomed() {
			d3.select(this).attr("transform", 
				"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}
        
//	var speed = 0.02;
//	var startTime = Date.now();
//	var currentTime = Date.now();
//   	d3.timer(function() {
//			
//			currentTime = Date.now();
//			
//			projection.rotate([speed * (currentTime - startTime), -15]).clipAngle(90);
//			
//            d3.select("#svg").selectAll("path").attr("d", path);
//            updateLocation();
//			
//		});
        
    updateLocation();

    });
});
