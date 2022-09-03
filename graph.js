var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height) 
  .style('background-color','rgb(173, 226, 215)')

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
    .attr('transform', 'translate(30,30)');
  
  gTime.call(sliderTime);
  
  d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));



var links = [];
var nodes = [];

d3.csv("london_stations.csv", function(data){
  for(var i=0; i<data.length; i++){
      var map = {
          "label":data[i]["station_name"]
        ,"id":data[i]["station_id"]
      }
      nodes.push(map);
  };
});
d3.csv("small_data.csv", function(data){

  for(var i=0; i<data.length; i++){

    var map = {
        "source":data[i]["start_station_id"]
      ,"target":data[i]["end_station_id"].split(".")[0],
      "strength":1
    }
    links.push(map);
};

        const simulation = d3.forceSimulation()
          .force("collide", d3.forceCollide().radius(50))
          .force('center', d3.forceCenter(width / 2, height / 2))

        var nodeElements = svg.append('g')
          .selectAll('circle')
          .data(nodes)
          .enter().append('circle')
            .attr('r', 7)
            .attr('fill', "black")

        var textElements = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
              .text(node => node.label)
              .attr('font-size', 15)
              .attr('dx', 15)
              .attr('dy', 4)
              .attr("opacity", 0)

      simulation.nodes(nodes).on('tick', () => {
              nodeElements
                .attr('cx', node => node.x)
                .attr('cy', node => node.y)
              textElements
                .attr('x', node => node.x)
                .attr('y', node => node.y)
            })

           simulation.force('link', d3.forceLink()
            .id(function(d,i) {
              return d.id;
          }).strength(link => link.strength)
            )

           
      const linkElements = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'steelblue')

      linkElements
          .attr('x1', function(d,i) {
            return d.source.x;
        })
      .attr('y1', link => link.source.y)
      .attr('x2', link => link.target.x)
      .attr('y2', link => link.target.y)


      simulation.force('link').links(links)
      simulation.on('tick', () => {
        nodeElements
        .attr('cx', node => node.x)
        .attr('cy', node => node.y)
      textElements
        .attr('x', node => node.x)
        .attr('y', node => node.y)
                linkElements
                .attr('x1', function(d,i) {
                  return d.source.x;
              })
            .attr('y1', link => link.source.y)
            .attr('x2', link => link.target.x)
            .attr('y2', link => link.target.y)
      })


  const dragDrop = d3.drag()
  .on('start', node => {
    node.fx = node.x
    node.fy = node.y
  })
  .on('drag', node => {
    simulation.alphaTarget(0.7).restart()
    node.fx = d3.event.x
    node.fy = d3.event.y
  })
  .on('end', node => {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
    }
    node.fx = null
    node.fy = null
  })
  nodeElements.call(dragDrop)

      

      function zoomed() {
        svg
        .selectAll('text') 
        .attr('transform', d3.event.transform);
        svg
        .selectAll('line') 
        .attr("stroke-width", 1/ d3.event.transform["k"])
        .attr('transform', d3.event.transform);
        if(d3.event.transform["k"]>1){
        svg
        .selectAll('circle') 
        .attr("r", 10/ d3.event.transform["k"])
        .attr('transform', d3.event.transform);
        }
        else{
          svg
        .selectAll('circle') 
        .attr('transform', d3.event.transform);
        }
       if(d3.event.transform["k"]>1.5){
        svg
        .selectAll('text') 
        .attr("font-size", 15/ d3.event.transform["k"])
        .attr('transform', d3.event.transform).attr("opacity", 1);
       }else{
        svg.selectAll('text') 
        .attr("opacity", 0)
        .attr('transform', d3.event.transform);
       }
        
      }

      var zoom = d3.zoom()
          .scaleExtent([-5, 200])
          .on('zoom', zoomed);
      svg.call(zoom);

});