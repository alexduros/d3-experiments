import * as d3 from "d3";

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    area = svg.append("g"),
    radius = 7,
    offset = 30,
    stepX  = width / 5;

const worfklow = [
  [{ id: "step#1.1", type: "node", radius: 10 }],
  [{ id: "step#1.j", type: "join", radius }],
  [{ id: "step#2.1", type: "node", radius }, { id: "step#2.2", type: "node", radius }],
  [{ id: "step#2.j", type: "join", radius }],
  [{ id: "step#3.1", type: "node", radius }, { id: "step#3.2", type: "node", radius }, { id: "step#3.3", type: "node", radius }],
  [{ id: "step#3.j", type: "join", radius }],
  [{ id: "step#4.1", type: "node", radius: 10 }],
];

const steps = worfklow.map((s: Array<any>, i: number) =>
  s.map((t, j: number) => ({
    id: t.id,
    type: t.type,
    radius: t.radius,
    x: (j * stepX + offset),
    y: (i * (height / worfklow.length) + offset)
  }))
);

const circles = steps
  .reduce((a, b) => a.concat(b), []);

const links = steps.reduce((a, b, i) => {
 const mainLine = (steps[i + 1] || []).map(t => ({
   id: `${b[0].id}-to-${t.id}`,
   source: b[0],
   target: t
 }));

 const otherLines =  steps[i + 1] ? b.slice(1, b.length).map(s => ({
   id: `${s.id}-to-${steps[i + 1][0].id}`,
   source: s,
   target: steps[i + 1][0]
 })) : [];

 return a
   .concat(mainLine)
   .concat(otherLines);
}, []);

const link = area.selectAll(".link")
  .data(links);

const circle = area.selectAll(".node")
  .data(circles);

const div = d3.select("body").append("div")
  .attr("class", "tooltip");

const project = (x, y) => {
  const angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
};

link.enter().append("path")
  .attr("class", "link")
  .attr("d", (d) =>
      "M" + d.source.x + "," + d.source.y
    + "C" + d.source.x + "," + (d.target.y + d.source.y) / 2
    + " " + d.source.x + "," + (d.target.y + d.source.y) / 2
    + " " + (d.target.x + d.source.x) / 2  + "," + (d.target.y + d.source.y) / 2
    + "S" + d.target.x + "," + (d.target.y + d.source.y) / 2
    + " " + d.target.x + "," + d.target.y
  );

circle.enter().append("circle")
  .attr("class", (d) => d.type)
  .attr("cx",    (d) => d.x)
  .attr("cy",    (d) => d.y)
  .attr("r",     (d) => d.radius)
  .on("mouseover", (d) => {
    div.style("opacity", 1);
    div.html(`<p>${d.id}</p>`)
       .style("left", (d3.event.target.getBoundingClientRect().left + 30) + "px")
       .style("top", (d3.event.target.getBoundingClientRect().top - (radius / 2)) + "px");
   })
  .on("mouseout", (d) => {
    div.transition()
      .duration(500)
      .style("opacity", 0);
  });

const zoomed = () => {
  const { k, x, y } = d3.event.transform;
  area.attr("transform", `translate(${x} ${y}) scale(${k})`);
};

const zoom = d3.zoom()
  .scaleExtent([1, 10])
  .on("zoom", zoomed);

svg.call(zoom);
