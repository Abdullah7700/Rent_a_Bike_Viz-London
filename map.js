var width =  950;
var height = 500;
var map_scale = 120000;
var scale = 1;

//Inspiration taken from internet
//For Time Visualization - Time Slider
var dataTime = d3.range(0, 4).map(function(d) {
  return new Date(2017 + d, 10, 3);
});

var sliderTime = d3
  .sliderBottom()
  .min(d3.min(dataTime))
  .max(d3.max(dataTime))
  .step(1000 * 60 * 60 * 24 * 365)
  .width(300)
  .tickFormat(d3.timeFormat('%Y'))
  .tickValues(dataTime)
  .default(new Date(1998, 10, 3))
  .on('onchange', val => {
    d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
  });

var gTime = d3
  .select('div#slider-time')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,40)');

gTime.call(sliderTime);

d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));


//Get the basic london boroughs map in the background
d3.json("london_boroughs.json", function(json) {
  d3.select('#content g.map')
    .selectAll('path')
     .data(json.features)
     .enter()
     .append("path")
     .attr("d", function(a) {
      return path(a);
    }).style("fill","rgba(0, 4, 53)").style("stroke","grey").style("stroke-width","2")

    //Mouseout & MouseOver
.on('mouseout', function (d, i) 
    {      
      const[xp, y] = d3.mouse(event.target);

      d3.select(this).style("fill","rgba(0, 4, 53)").style('fill-opacity', 1).attr("r", 2/scale)
      
      d3.select('.tooltip').transition().duration(0).style("opacity", .0);
      
      d3.select('.tooltip').html(`${d.properties.name}`,)
      .style("left", (xp) + "px")
      .style("top", (y - 2) + "px");
    })

    .on('mouseover', function (d, i) 
    {      
      const[xp, y] = d3.mouse(event.target);
      d3.select(this).style("fill","orange").style('fill-opacity', 1).attr("r", 4/scale)
      
      d3.select('.tooltip').transition().duration(200).style("opacity", .8);
      
      d3.select('.tooltip').html(`${d.properties.name}`)
      .style("left", (xp - 50 / scale) + "px")
      .style("top", (y + 15 / scale) + "px");
    });

    
    //Adding the station data
    d3.csv("london_stations.csv", function(data)
    {
      projection
      .center([-0.18, 51.52])
      .scale(map_scale)
      .translate([width / 2, height / 2]);

      var proj = d3.select('#content g.map')
        .selectAll('circle')
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 1.5)
        .attr("cx", function (d) 
        { 
          var i = projection([d.longitude, d.latitude])
          return  i[0];
        })
        .attr("cy", function (d) {
          var i = projection([d.longitude, d.latitude])
          return  i[1];
           
         })

        proj.transition()
        .style("fill", "white")

          proj.on('mouseover', function (d, i) {
            console.log(d);
            const[xp, y] = d3.mouse(event.target);
            d3.select(this).style("fill","yellow").style('fill-opacity', 1)
            .attr("r", 4)
           
            d3.select('.tooltip').transition()		
            .duration(200)		
            .style("opacity", .9);		
            d3.select('.tooltip')	.html(`Station ID: ${d.station_id} And Station Name: ${d.station_name}`)	
            .style("left", (xp + 25/scale) + "px")		
            .style("top", (y - 25/scale) + "px");	

          })
          proj.on('mouseout', function (d, i) {
            const[xp, y] = d3.mouse(event.target);
            d3.select(this).style("fill","green").style('fill-opacity', 1)
            .attr("r", 2)
            d3.select('.tooltip').transition()		
                      .duration(200)		
                      .style("opacity", .0);		
                      d3.select('.tooltip')	.html(`Station ID: ${d.station_id} And Station Name: ${d.station_name}`)	
                      .style("left", (xp) + "px")		
                      .style("top", (y - 2) + "px");	    
          });
    });

//Data not filtering properly

/*d3.select("div#slider-time").on('change', function(d){
selectedoption = d3.select(this).property("value")
console.log(selectedoption)
d3.selectall('line').remove()

d3.csv("data.csv", function(data)  {

  data = data.filter(d => { 
    return (
      d.year = selectedoption
    );
  });
  
  projection
  .center([-0.18, 51.52])
  .scale(map_scale)
  .translate([width / 2, height / 2]);
 
  d3.select('#content g.map')
    .selectAll('line')
    .data(data)
    .enter()
    .append("line")

    .attr("y1", function(d) 
    {
      var i = [parseFloat(d['end_longitude']),parseFloat(d['end_latitude'])];
      return projection(i)[1];
    })

    .attr("x1", function(d) 
    {
      var i = [parseFloat(d['end_longitude']),parseFloat(d['end_latitude'])];
      return projection(i)[0];
    })

    .attr("y2", function(d) 
    {
      var i = [parseFloat(d['end_longitude']),parseFloat(d['end_latitude'])];
      return projection(i)[1];
    })

    .attr("x2", function(d) 
    {
      var i = [parseFloat(d['end_longitude']),parseFloat(d['end_latitude'])];
      return projection(i)[0];
    })

    .transition()

    .duration(7000)

    .attr("y2", function(d) 
    {
      var i = [parseFloat(d['start_longitude']),parseFloat(d['start_latitude'])];
      return projection(i)[1];
    })

    .attr("x2", function(d) 
    {
      var i = [parseFloat(d['start_longitude']),parseFloat(d['start_latitude'])];
      return projection(i)[0];
    })

});
});*/

//Visualizing edges of the small data from the given dataset
    d3.csv("data.csv", function(data){
      projection
      .center([-0.18, 51.52])
      .scale(map_scale)
      .translate([width / 2, height / 2]);
     
      d3.select('#content g.map')
        .selectAll('line')
        .data(data)
        .enter()
        .append("line")

        .attr("y1", function(d) 
        {
          var i = [parseFloat(d['end_longitude']),parseFloat(d['end_latitude'])];
          return projection(i)[1];
        })

        .attr("x1", function(d) 
        {
          var i = [parseFloat(d['end_longitude']),parseFloat(d['end_latitude'])];
          return projection(i)[0];
        })

        .attr("y2", function(d) 
        {
          var i = [parseFloat(d['end_longitude']),parseFloat(d['end_latitude'])];
          return projection(i)[1];
        })

        .attr("x2", function(d) 
        {
          var i = [parseFloat(d['end_longitude']),parseFloat(d['end_latitude'])];
          return projection(i)[0];
        })

        .transition()

        .duration(7000)

        .attr("y2", function(d) 
        {
          var i = [parseFloat(d['start_longitude']),parseFloat(d['start_latitude'])];
          return projection(i)[1];
        })

        .attr("x2", function(d) 
        {
          var i = [parseFloat(d['start_longitude']),parseFloat(d['start_latitude'])];
          return projection(i)[0];
        })
    });
});

//Using geoMercator for projection
var projection = d3.geoMercator()
.center([-0.18, 51.52])
    .scale(map_scale)
    .translate([width / 2, height / 2]);

//Zoom in function
function zoom_in() 
{
    scale = d3.event.transform["k"];
    svg
    .selectAll('path') 
    .attr('transform', d3.event.transform);
    svg
    .selectAll('circle') 
    .attr("r", 3/ d3.event.transform["k"])
    .attr('transform', d3.event.transform);
    svg
    .selectAll('line') 
    .attr("stroke-width", 2/ d3.event.transform["k"])
    .attr('transform', d3.event.transform);
}

var focus = d3.zoom()
    .scaleExtent([1, 100])
    .on('zoom', zoom_in);

var path = d3.geoPath().projection(projection);

var svg = d3.select('#content g.map');
svg.attr("stroke","orange")
svg.call(focus);