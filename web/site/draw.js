import * as d3 from "d3";

var svg = d3.select("body").append("svg");

var currentPoints = [];
var lastDrawPoint;
var dragging = false;
var drawing = false;

var pointDragger = d3
    .drag()
    .on("drag", function (event) {
        if (drawing) return;
        dragging = true;
        let cursor = [event.x, event.y];
        d3.select(this)
            .data([cursor])
            .attr("cx", cursor[0])
            .attr("cy", cursor[1]);
        let newPoints = d3.select(this.parentNode).selectAll("circle").data();
        d3.select(this.parentNode)
            .select("polygon")
            .data([newPoints])
            .attr("points", newPoints);
    })
    .on("end", function () {
        dragging = false;
    });

export function drawPolygon(points, config) {
    const defaultConfig = {
        color: "red",
        vertexColor: "#FDBC07",
        vertexSize: 5,
        close: true,
        fixed: true,
    };
    let c = {
        ...defaultConfig,
        ...config,
    };
    let g = svg.append("g");
    if (c.close) {
        g.selectAll("polygon")
            .data([points])
            .join("polygon")
            .attr("points", (d) => d)
            .style("fill", c.color);
    } else {
        g.append("polyline")
            .attr("points", points)
            .style("fill", "none")
            .attr("stroke", "#000");
    }
    let circles = g
        .selectAll("circle")
        .data(points)
        .join("circle")
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("r", c.vertexSize)
        .attr("fill", c.vertexColor)
        .attr("stroke", "#000");
    if (c.close && !c.fixed) {
        circles.style("cursor", "move").call(pointDragger);
    } else if (!c.close) {
        circles.attr("is-handle", true).style("cursor", "pointer");
    }
    return g;
}

export function drawLines(lines, lineColor = "#FDBC07") {
    let g = svg.append("g");
    g.selectAll("line")
        .data(lines)
        .join("line")
        .attr("x1", (d) => d[0][0])
        .attr("y1", (d) => d[0][1])
        .attr("x2", (d) => d[1][0])
        .attr("y2", (d) => d[1][1])
        .attr("stroke", lineColor)
        .attr("stroke-width", 1);
}

svg.on("mouseup", function (event) {
    if (dragging) return;
    drawing = true;
    let cursor = d3.pointer(event);
    lastDrawPoint = cursor;
    if (event.target.hasAttribute("is-handle")) {
        if (currentPoints.length <= 2) {
            return;
        }
        svg.select("g.drawing").remove();
        drawPolygon(currentPoints, {
            color: getRandomColor(),
            vertexColor: "#FDBC07",
            fixed: false,
        });
        currentPoints = [];
        drawing = false;
    } else {
        currentPoints.push(cursor);
        svg.select("g.drawing").remove();
        let g = drawPolygon(currentPoints, {
            vertexColor: "yellow",
            close: false,
        });
        g.attr("class", "drawing");
    }
});

svg.on("mousemove", function (event) {
    if (!drawing) return;
    let cursor = d3.pointer(event);
    let g = d3.select("g.drawing");
    g.select("line").remove();
    g.insert("line", ":first-child")
        .attr("x1", lastDrawPoint[0])
        .attr("y1", lastDrawPoint[1])
        .attr("x2", cursor[0])
        .attr("y2", cursor[1])
        .attr("stroke", "#53DBF3")
        .attr("stroke-width", 1);
});

function getRandomColor() {
    let letters = "0123456789ABCDEF".split("");
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color + "CC";
}
