import * as d3 from "d3";

var width = window.innerWidth;
var height = window.innerHeight;
var svg = d3.select("body").append("svg");
var canvas = svg.append("g");
var gX = svg.append("g");
var gY = svg.append("g");

var zoom = d3.zoom().scaleExtent([0.2, 50]).on("zoom", zoomed);
var currentTransform = d3.zoomIdentity;
svg.call(zoom);

var currentPoints = [];
var lastDrawPoint;
var dragging = false;
var drawing = false;

var xScale = d3
    .scaleLinear()
    .domain([0, width])
    .range([30, width - 10])
    .nice();
var yScale = d3
    .scaleLinear()
    .domain([0, height])
    .range([height - 20, 10])
    .nice();

var xAxis = (g, scale) =>
    g
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisTop(scale).ticks(12))
        .call(g => g.select(".domain").attr("display", "none"));
var yAxis = (g, scale) =>
    g
        .attr("transform", `translate(${0},0)`)
        .call(d3.axisRight(scale).ticks(12))
        .call(g => g.select(".domain").attr("display", "none"));

function zoomed({ transform }) {
    currentTransform = transform;
    applyTransform();
    gX.call(xAxis, transform.rescaleX(xScale));
    gY.call(yAxis, transform.rescaleY(yScale));
}

function updateInitTransform(points) {
    let [minX, maxX] = d3.extent(points, p => p[0]);
    let [minY, maxY] = d3.extent(points, p => p[1]);
    let k =
        Math.min(
            Math.abs(width / (xScale(maxX - minX) - xScale(0))),
            Math.abs(height / (yScale(maxY - minY) - yScale(0))),
        ) * 0.8;
    let x = (width - (xScale(minX) + xScale(maxX)) * k) / 2;
    let y = (height - (yScale(maxY) + yScale(minY)) * k) / 2;
    currentTransform = d3.zoomIdentity.translate(x, y).scale(k);
    svg.call(zoom.transform, currentTransform);
}

function applyTransform() {
    let trans = currentTransform;
    let tx = trans.rescaleX(xScale);
    let ty = trans.rescaleY(yScale);
    canvas
        .selectAll("circle")
        .attr("cx", d => tx(d[0]))
        .attr("cy", d => ty(d[1]));
    canvas
        .selectAll("line")
        .attr("x1", d => tx(d[0][0]))
        .attr("y1", d => ty(d[0][1]))
        .attr("x2", d => tx(d[1][0]))
        .attr("y2", d => ty(d[1][1]));
    canvas.selectAll("polygon").attr("points", d => d.map(p => [tx(p[0]), ty(p[1])]));
}

var pointDragger = d3
    .drag()
    .on("drag", function (event) {
        if (drawing) return;
        dragging = true;
        let point = [
            currentTransform.rescaleX(xScale).invert(event.x),
            currentTransform.rescaleY(yScale).invert(event.y),
        ];
        d3.select(this).data([point]);
        let newPoints = d3.select(this.parentNode).selectAll("circle").data();
        d3.select(this.parentNode).select("polygon").data([newPoints]);
        applyTransform();
    })
    .on("end", function () {
        dragging = false;
    });

export function drawPolygon(points, config) {
    updateInitTransform(points);

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
    let g = canvas.append("g");
    if (c.close) {
        g.selectAll("polygon").data([points]).join("polygon").style("fill", c.color);
    } else {
        g.append("polyline").attr("points", points).style("fill", "none").attr("stroke", "#000");
    }

    let circles = g
        .selectAll("circle")
        .data(points)
        .join("circle")
        .attr("r", c.vertexSize)
        .attr("fill", c.vertexColor)
        .attr("stroke", "#000");
    if (c.close && !c.fixed) {
        circles.style("cursor", "move").call(pointDragger);
    } else if (!c.close) {
        circles.attr("is-handle", true).style("cursor", "pointer");
    }

    applyTransform();
    return g;
}

export function drawLines(lines, lineColor = "#FDBC07") {
    let g = canvas.append("g");
    g.selectAll("line")
        .data(lines)
        .join("line")
        .attr("x1", d => d[0][0])
        .attr("y1", d => d[0][1])
        .attr("x2", d => d[1][0])
        .attr("y2", d => d[1][1])
        .attr("stroke", lineColor)
        .attr("stroke-width", 1);
    applyTransform();
    return g;
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
        canvas.select("g.drawing").remove();
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
