import * as d3 from "d3";

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = 32;

const circles = d3.range(20).map(function() {
  return {
    x: Math.round(Math.random() * (width - radius * 2) + radius),
    y: Math.round(Math.random() * (height - radius * 2) + radius)
  };
});

const color = d3.scaleOrdinal()
  .range(d3.schemeCategory20);

const circle = svg.selectAll("g")
  .data(circles)
  .enter()
    .append("g");

circle.append("circle")
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .attr("r", radius)
  .style("fill", (d, i) => color("" + i) as string);