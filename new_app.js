var width = 1000;
var height = 600;
var scale_of_my_map = 80000;
var scale = 1;

var projection = d3.geoMercator()
    .center([-0.18, 51.52])
    .scale(scale_of_my_map)
    .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

d3.json("london_boroughs.json", function(json) {
    d3.select('#content g.map')
        .selectAll('path')

    .data(json.features)
        .enter()
        .append("path")
        .attr("d", function(d) {
            return path(d);
        }).style("fill", "rgba(0, 4, 53)").style("stroke", "white").style("stroke-width", "2");

    d3.csv("london_stations.csv", function(data) {
        projection
            .center([-0.18, 51.52])
            .scale(scale_of_my_map)
            .translate([width / 2, height / 2]);
        var abs = d3.select('#content g.map')
            .selectAll('circle')
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 2)
            .attr("cx", function(d) {
                var i = [parseFloat(d['longitude']), parseFloat(d['latitude'])];
                return projection(i)[0];

            })
            .attr("cy", function(d) {
                var i = [parseFloat(d['longitude']), parseFloat(d['latitude'])];
                return projection(i)[1];

            })

        abs.transition()
            .duration(1000)
            .style("fill", "yellow")
    });


    d3.csv("small_data.csv", function(data) {
        projection
            .center([-0.18, 51.52])
            .scale(scale_of_my_map)
            .translate([width / 2, height / 2]);
        d3.select('#content g.map')
            .selectAll('line')
            .data(data)
            .enter()
            .append("line")
            .attr("y1", function(d) {
                var i = [parseFloat(d['end_longitude']), parseFloat(d['end_latitude'])];
                return projection(i)[1];
            })
            .attr("x1", function(d) {
                var i = [parseFloat(d['end_longitude']), parseFloat(d['end_latitude'])];
                return projection(i)[0];
            })
            .attr("y2", function(d) {
                var i = [parseFloat(d['end_longitude']), parseFloat(d['end_latitude'])];
                return projection(i)[1];
            })
            .attr("x2", function(d) {
                var i = [parseFloat(d['end_longitude']), parseFloat(d['end_latitude'])];
                return projection(i)[0];
            })
            .transition()
            .duration(5000)
            .attr("y2", function(d) {
                var i = [parseFloat(d['start_longitude']), parseFloat(d['start_latitude'])];
                return projection(i)[1];
            })
            .attr("x2", function(d) {
                var i = [parseFloat(d['start_longitude']), parseFloat(d['start_latitude'])];
                return projection(i)[0];
            })
            .style("fill", "red").style("stroke", "white");
    });
});
var svg = d3.select('#content g.map');
svg.attr("stoke", "white")
svg.call(zoom);