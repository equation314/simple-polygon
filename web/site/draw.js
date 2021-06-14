import * as d3 from "d3";
import $ from "jquery";

const ENDPOINT_COLOR = "#996f6e";
const POLY_EDGE_COLOR = "#ccc";
const POLY_EDGE_COLOR_DRAWING = "#000";
const POLY_EDGE_COLOR_CURRENT = "#53DBF3";
const POLY_VERTEX_COLOR = "#FDBC07";
const POLY_VERTEX_COLOR_DRAWING = "yellow";

export class Draw {
    constructor() {
        let svg = d3.select("body").append("svg");
        let width = $("svg").width();
        let height = $("svg").height();

        let gGrid = svg.append("g");
        let gCanvas = svg.append("g").attr("class", "canvas");
        let gX = svg.append("g");
        let gY = svg.append("g");

        let xticks = width / 50;
        let yticks = height / 50;

        let xScale = d3.scaleLinear().domain([0, width]).range([0, width]).nice();
        let yScale = d3.scaleLinear().domain([0, height]).range([height, 0]).nice();
        let xAxis = (g, scale) =>
            g
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisTop(scale).ticks(xticks))
                .call(g => g.select(".domain").attr("display", "none"));
        let yAxis = (g, scale) =>
            g
                .attr("transform", `translate(${0},0)`)
                .call(d3.axisRight(scale).ticks(yticks))
                .call(g => g.select(".domain").attr("display", "none"));
        let grid = (g, x, y) =>
            g
                .attr("stroke", "currentColor")
                .attr("stroke-opacity", 0.1)
                .call(g =>
                    g
                        .selectAll(".x")
                        .data(x.ticks(xticks))
                        .join(
                            enter => enter.append("line").attr("class", "x").attr("y2", height),
                            update => update,
                            exit => exit.remove(),
                        )
                        .attr("x1", d => x(d))
                        .attr("x2", d => x(d)),
                )
                .call(g =>
                    g
                        .selectAll(".y")
                        .data(y.ticks(yticks))
                        .join(
                            enter => enter.append("line").attr("class", "y").attr("x2", width),
                            update => update,
                            exit => exit.remove(),
                        )
                        .attr("y1", d => y(d))
                        .attr("y2", d => y(d)),
                );

        let dragging = false;
        let lastDrawPoint;
        let zoomed = ({ transform }) => {
            this.currentTransform = transform;
            this.applyTransform();
            let tx = this.transX();
            let ty = this.transY();
            gX.call(xAxis, tx);
            gY.call(yAxis, ty);
            gGrid.call(grid, tx, ty);
        };
        let ondrag = (target, event) => {
            if (this.drawing || this.mode == "fixed") return;
            dragging = true;
            let itx = this.invertTransX();
            let ity = this.invertTransY();
            let point = [itx(event.x), ity(event.y)];
            d3.select(target).data([point]);

            let parent = d3.select(target.parentNode);
            if (parent.classed("polygon")) {
                this.removeShape("tri-lines");
                this.removeShape("path-lines");
                let newPoints = parent.selectAll(".polygon > circle").data();
                parent.select("polyline").data([newPoints.concat([newPoints[0]])]);
                this.currentPolygon = newPoints;
                this.onPolygonUpdatedCallback(newPoints);
            } else if (parent.classed("endpoint")) {
                this.removeShape("path-lines");
                let newPoints = this.canvas.selectAll(".endpoint > circle").data();
                this.currentEndpoints = newPoints;
            }
            this.applyTransform();
        };
        let onmouseup = event => {
            if (dragging) return;
            switch (this.mode) {
                case "draw-polygon":
                    if (this.currentPolygon.length) return;
                    break;
                case "draw-points":
                    if (this.currentEndpoints.length) return;
                    break;
                default:
                    return;
            }
            this.drawing = true;
            let itx = this.invertTransX();
            let ity = this.invertTransY();
            let cursor = d3.pointer(event);
            let point = [itx(cursor[0]), ity(cursor[1])];
            if (this.mode == "draw-polygon") {
                lastDrawPoint = point;
                if (event.target.hasAttribute("is-handle")) {
                    if (this.currentDrawPoints.length <= 2) {
                        return;
                    }
                    this.removeShape("polygon-drawing");
                    let rgba = $("#pick-color").val() + "77";
                    this.drawPolygon(this.currentDrawPoints, {
                        color: rgba,
                        vertexColor: POLY_VERTEX_COLOR,
                        fixed: false,
                    });
                    this.currentDrawPoints = [];
                    this.drawing = false;
                    this.mode = "move";
                } else {
                    this.currentDrawPoints.push(point);
                    this.removeShape("polygon-drawing");
                    this.drawPolygon(this.currentDrawPoints, {
                        vertexColor: POLY_VERTEX_COLOR_DRAWING,
                        close: false,
                    });
                }
            } else if (this.mode == "draw-points") {
                this.currentDrawPoints.push(point);
                this.drawPoint(point, { fixed: false }, "endpoint");
                if (this.currentDrawPoints.length == 2) {
                    this.currentEndpoints = this.currentDrawPoints;
                    this.onEndpointsDrawnCallback(this.currentEndpoints);
                    this.currentDrawPoints = [];
                    this.drawing = false;
                    this.mode = "move";
                }
            }
        };
        let onmousemove = event => {
            if (!this.drawing || this.mode != "draw-polygon") return;
            let itx = this.invertTransX();
            let ity = this.invertTransY();
            let cursor = d3.pointer(event);
            let point = [itx(cursor[0]), ity(cursor[1])];
            let g = this.canvas.select("g.polygon-drawing");
            g.select("line").remove();
            g.insert("line", ":first-child")
                .data([[lastDrawPoint, point]])
                .attr("stroke", POLY_EDGE_COLOR_CURRENT)
                .attr("stroke-width", 1);
            this.applyTransform();
        };

        this.zoom = d3
            .zoom()
            .scaleExtent([0.2, 70])
            .on("start", event => {
                if (event.sourceEvent && event.sourceEvent.type != "wheel")
                    svg.attr("cursor", "grab");
            })
            .on("zoom", zoomed)
            .on("end", () => svg.attr("cursor", "default"))
            .filter(event => {
                if (this.mode == "move" || this.mode == "fixed") return true;
                else return event.type != "mouseup" && event.type != "mousedown";
            });

        this.pointDragger = d3
            .drag()
            .on("drag", function (event) {
                ondrag(this, event);
            })
            .on("end", () => (dragging = false));
        svg.on("mouseup", onmouseup);
        svg.on("mousemove", onmousemove);
        svg.call(this.zoom);

        this.drawing = false;
        this.currentDrawPoints = [];
        this.currentPolygon = [];
        this.currentEndpoints = [];
        this.polygonDrawnCallback = this.polygonDestroyedCallback = this.onPolygonUpdatedCallback = this.onEndpointsDrawnCallback = () => {};

        this.mode = "move";
        this.width = width;
        this.height = height;

        this.svg = svg;
        this.canvas = gCanvas;
        this.currentTransform = d3.zoomIdentity;
        this.xScale = xScale;
        this.yScale = yScale;
        this.autoScale([]);
    }

    onPolygonDrawn(callback) {
        this.polygonDrawnCallback = callback;
    }

    onPolygonDestroyed(callback) {
        this.polygonDestroyedCallback = callback;
    }

    onPolygonUpdated(callback) {
        this.onPolygonUpdatedCallback = callback;
    }

    onEndpointsDrawn(callback) {
        this.onEndpointsDrawnCallback = callback;
    }

    clearCanvas() {
        this.drawing = false;
        this.removeShape("polygon");
        this.removeShape("endpoint");
        this.polygonDestroyedCallback(this.currentPolygon);
        this.currentDrawPoints = [];
        this.currentPolygon = [];
        this.currentEndpoints = [];
    }

    clearAlgorithmResult() {
        this.removeShape("stepping");
        this.removeShape("tri-lines");
        this.removeShape("path-lines");
    }

    setMode(mode) {
        if (["move", "draw-polygon", "draw-points", "fixed"].includes(mode)) {
            this.mode = mode;
        }
    }

    transX() {
        return this.currentTransform.rescaleX(this.xScale);
    }

    transY() {
        return this.currentTransform.rescaleY(this.yScale);
    }

    invertTransX() {
        return this.currentTransform.rescaleX(this.xScale).invert;
    }

    invertTransY() {
        return this.currentTransform.rescaleY(this.yScale).invert;
    }

    applyTransform() {
        let tx = this.transX();
        let ty = this.transY();
        this.canvas
            .selectAll("circle")
            .attr("cx", d => tx(d[0]))
            .attr("cy", d => ty(d[1]));
        this.canvas
            .selectAll("line")
            .attr("x1", d => tx(d[0][0]))
            .attr("y1", d => ty(d[0][1]))
            .attr("x2", d => tx(d[1][0]))
            .attr("y2", d => ty(d[1][1]));
        this.canvas.selectAll("polygon").attr("points", d => d.map(p => [tx(p[0]), ty(p[1])]));
        this.canvas.selectAll("polyline").attr("points", d => d.map(p => [tx(p[0]), ty(p[1])]));
    }

    autoScale(points) {
        let [minX, maxX] = d3.extent(points, p => p[0]);
        let [minY, maxY] = d3.extent(points, p => p[1]);
        if (!points.length) {
            minX = maxX = minY = maxY = 0;
        }
        let k =
            Math.min(
                Math.abs(this.width / (this.xScale(maxX - minX + 1) - this.xScale(0))),
                Math.abs(this.height / (this.yScale(maxY - minY + 1) - this.yScale(0))),
            ) * 0.8;
        k = Math.min(Math.max(k, 0.2), 50);
        let x = (this.width - (this.xScale(minX) + this.xScale(maxX)) * k) / 2;
        let y = (this.height - (this.yScale(maxY) + this.yScale(minY)) * k) / 2;
        this.currentTransform = d3.zoomIdentity.translate(x, y).scale(k);
        this.svg.call(this.zoom.transform, this.currentTransform);
    }

    hasShape(className) {
        return !this.canvas.selectAll(`g.${className}`).empty();
    }

    removeShape(className) {
        this.canvas.selectAll(`g.${className}`).remove();
    }

    toggleShape(className) {
        let shape = this.canvas.selectAll(`g.${className}`);
        shape.attr("opacity", 1 - shape.attr("opacity"));
    }

    setShapeStyle(shapeName, className, styleName, styleValue) {
        this.canvas.selectAll(`${shapeName}.${className}`).style(styleName, styleValue);
    }

    drawPolygon(points, config, className = "") {
        const defaultConfig = {
            color: "red",
            vertexColor: POLY_VERTEX_COLOR,
            vertexSize: 5,
            close: true,
            fixed: true,
        };
        let c = {
            ...defaultConfig,
            ...config,
        };

        if (c.close) {
            className += " polygon-drawn";
        } else {
            className += " polygon-drawing";
        }
        className += " polygon";
        let g = this.canvas.append("g").attr("class", className);
        if (c.close) {
            g.append("polyline")
                .data([points.concat([points[0]])])
                .attr("class", className)
                .style("fill", c.color)
                .attr("stroke", POLY_EDGE_COLOR);
            this.currentPolygon = points;
        } else {
            g.append("polyline")
                .data([points])
                .attr("class", className)
                .style("fill", "none")
                .attr("stroke", POLY_EDGE_COLOR_DRAWING);
        }

        if (c.vertexSize > 0) {
            let circles = g
                .selectAll("circle")
                .data(points)
                .join("circle")
                .attr("class", className)
                .attr("r", c.vertexSize)
                .attr("fill", c.vertexColor)
                .attr("stroke", "#000");
            if (c.close && !c.fixed) {
                circles.style("cursor", "move").call(this.pointDragger);
            } else if (!c.close) {
                circles.attr("is-handle", true).style("cursor", "pointer");
            }
        }

        this.applyTransform();
        if (c.close) {
            this.polygonDrawnCallback(points);
        }
    }

    drawPath(points, config, className = "") {
        const defaultConfig = {
            color: "#000",
            dashed: false,
            width: 1,
        };
        let c = {
            ...defaultConfig,
            ...config,
        };
        let parent = this.canvas.select(".polygon");
        let g = parent.insert("g", "circle").attr("opacity", 1).attr("class", className);
        let path = g
            .append("polyline")
            .data([points])
            .style("fill", "none")
            .attr("class", className)
            .attr("stroke", c.color)
            .attr("stroke-width", c.width);
        if (c.dashed) {
            path.style("stroke-dasharray", "5 5");
        }
        this.applyTransform();
    }

    drawLines(lines, config, className = "") {
        const defaultConfig = {
            color: "#000",
            dashed: false,
            width: 1,
        };
        let c = {
            ...defaultConfig,
            ...config,
        };
        let parent = this.canvas.select(".polygon");
        let before = !parent.selectChild(".path-lines").empty() ? ".path-lines" : "circle";
        let g = parent.insert("g", before).attr("opacity", 1).attr("class", className);
        let l = g
            .selectAll("line")
            .data(lines)
            .join("line")
            .attr("class", className)
            .attr("stroke", c.color)
            .attr("stroke-width", c.width);
        if (c.dashed) {
            l.style("stroke-dasharray", "5 5");
        }
        this.applyTransform();
    }

    drawPoint(point, config, className = "") {
        const defaultConfig = {
            color: ENDPOINT_COLOR,
            size: 5,
            fixed: true,
        };
        let c = {
            ...defaultConfig,
            ...config,
        };
        let g = this.canvas.append("g").attr("class", className);
        let circle = g
            .append("circle")
            .data([point])
            .attr("class", className)
            .attr("r", c.size)
            .attr("fill", c.color)
            .attr("stroke", "#000");
        if (!c.fixed) {
            circle.style("cursor", "move").call(this.pointDragger);
        }
        this.applyTransform();
    }

    getCurrentPolygon() {
        return this.currentPolygon;
    }

    getCurrentEndpoints() {
        return this.currentEndpoints;
    }
}
