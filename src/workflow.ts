import * as d3 from "d3";

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = 10;

const worfklow = [
  [{ id: "step#1.1" }],
  [{ id: "step#2.1" }, { id: "step#2.2" }],
  [{ id: "step#3.1" }, { id: "step#3.2" }, { id: "step#3.3" }],
  [{ id: "step#1.1" }],
];

const steps = worfklow.map((s: Array<any>, i: number) =>
  s.map((t, j: number) => ({
    id: t.id,
    x: (j * (width / s.length)),
    y: (i * (height / worfklow.length))
  }))
);

const circles = steps
  .reduce((a, b) => a.concat(b), []);

const links = steps.reduce((a, b, i) => {
   return a.concat((steps[i + 1] || []).map(t => ({
     id: `${b[0].id}-to-${t.id}`,
     source: b[0],
     target: t
   })));
}, []);

const link = svg.selectAll(".link")
  .data(links);

const circle = svg.selectAll(".node")
  .data(circles);

link.enter().append("line")
  .attr("class", "link")
  .attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });

circle.enter().append("circle")
  .attr("class", "node")
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .attr("r", radius);