import * as d3 from "d3";

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = 7,
    offset = 30,
    area = svg.append("g").attr("transform", `translate(${offset} ${offset})`),
    stepX  = width / 5;

type Link = {
  id: string,
  source: Node,
  target: Node,
};

type Links = Link[];

type Node = {
  id: string,
  type: string,
  radius: number,
  x: number,
  y: number,
};

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
    x: (j * stepX),
    y: (i * (height / worfklow.length))
  }) as Node)
);

const circles = steps
  .reduce((a, b) => a.concat(b), []);

const links: Links = steps.reduce((a, b, i) => {
 const mainLine: Links = (steps[i + 1] || []).map(t => ({
   id: `${b[0].id}-to-${t.id}`,
   source: b[0],
   target: t
 }));

 const otherLines: Links =  steps[i + 1] ? b.slice(1, b.length).map(s => ({
   id: `${s.id}-to-${steps[i + 1][0].id}`,
   source: s,
   target: steps[i + 1][0]
 })) : [];

 return a
   .concat(mainLine)
   .concat(otherLines);
}, [] as Links);

const link = area.selectAll(".link")
  .data(links)
  .enter().append("path");

const circle = area.selectAll(".node")
  .data(circles)
  .enter().append("circle");

const div = d3.select("body").append("div")
  .attr("class", "tooltip");

link
  .attr("class", "link")
  .attr("d", (d) =>
      "M" + d.source.x + "," + d.source.y
    + "C" + d.source.x + "," + (d.target.y + d.source.y) / 2
    + " " + d.source.x + "," + (d.target.y + d.source.y) / 2
    + " " + (d.target.x + d.source.x) / 2  + "," + (d.target.y + d.source.y) / 2
    + "S" + d.target.x + "," + (d.target.y + d.source.y) / 2
    + " " + d.target.x + "," + d.target.y
  );

circle
  .attr("class", (d: Node) => d.type)
  .attr("cx",    (d: Node) => d.x)
  .attr("cy",    (d: Node) => d.y)
  .attr("r",     (d: Node) => d.radius)
  .on("mouseover", (d: Node) => {
    div.style("opacity", 1);
    div.html(`<p>${d.id}</p>`)
       .style("left", (d3.event.target.getBoundingClientRect().left + 30) + "px")
       .style("top", (d3.event.target.getBoundingClientRect().top - (radius / 2)) + "px");
   })
  .on("mouseout", (d: Node) => {
    div.transition()
      .duration(500)
      .style("opacity", 0);
  });

const zoomed = () => {
  const { k, x, y } = d3.event.transform;
  area.attr("transform", `translate(${offset + x} ${offset + y}) scale(${k})`);
};

const zoom = d3.zoom()
  .scaleExtent([1, 10])
  .on("zoom", zoomed);

svg.call(zoom);

circle.transition()
  .duration(1000)
  .on("start", function repeat() {
    d3.active(this)
        .style("fill", "red")
      .transition()
        .style("fill", "blue")
      .transition()
        .on("start", repeat);
   });
