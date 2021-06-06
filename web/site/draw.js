import * as d3 from "d3";
import $ from "jquery";

export class Draw {
    constructor() {
        let svg = d3.select("body").append("svg");
        let width = $("svg").width();
        let height = $("svg").height();

        let gGrid = svg.append("g");
        let gCanvas = svg.append("g");
        let gX = svg.append("g");
        let gY = svg.append("g");

        let xScale = d3.scaleLinear().domain([0, width]).range([0, width]).nice();
        let yScale = d3.scaleLinear().domain([0, height]).range([height, 0]).nice();

        let xAxis = (g, scale) =>
            g
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisTop(scale).ticks(12))
                .call(g => g.select(".domain").attr("display", "none"));
        let yAxis = (g, scale) =>
            g
                .attr("transform", `translate(${0},0)`)
                .call(d3.axisRight(scale).ticks((12 * height) / width))
                .call(g => g.select(".domain").attr("display", "none"));

        let grid = (g, x, y) =>
            g
                .attr("stroke", "currentColor")
                .attr("stroke-opacity", 0.1)
                .call(g =>
                    g
                        .selectAll(".x")
                        .data(x.ticks(12))
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
                        .data(y.ticks((12 * height) / width))
                        .join(
                            enter => enter.append("line").attr("class", "y").attr("x2", width),
                            update => update,
                            exit => exit.remove(),
                        )
                        .attr("y1", d => y(d))
                        .attr("y2", d => y(d)),
                );

        let dragging = false;
        let drawing = false;
        let currentPoints = [];
        let lastDrawPoint;
        let zoomed = ({ transform }) => {
            this.currentTransform = transform;
            this.applyTransform();
            let tx = transform.rescaleX(xScale);
            let ty = transform.rescaleY(yScale);
            gX.call(xAxis, tx);
            gY.call(yAxis, ty);
            gGrid.call(grid, tx, ty);
        };
        let ondrag = (target, event) => {
            if (drawing || this.mode == "fixed") return;
            dragging = true;
            let itx = this.invertTransX();
            let ity = this.invertTransY();
            let point = [itx(event.x), ity(event.y)];
            d3.select(target).data([point]);
            let newPoints = d3.select(target.parentNode).selectAll("circle").data();
            d3.select(target.parentNode).select("polygon").data([newPoints]);
            this.applyTransform();
        };
        let onmouseup = event => {
            if (dragging || this.drawn || this.mode != "draw") return;
            drawing = true;
            let itx = this.invertTransX();
            let ity = this.invertTransY();
            let cursor = d3.pointer(event);
            let point = [itx(cursor[0]), ity(cursor[1])];
            lastDrawPoint = point;
            if (event.target.hasAttribute("is-handle")) {
                if (currentPoints.length <= 2) {
                    return;
                }
                this.canvas.select("g.drawing").remove();
                this.drawPolygon(currentPoints, {
                    color: getRandomColor(),
                    vertexColor: "#FDBC07",
                    fixed: false,
                });
                currentPoints = [];
                drawing = false;
                this.drawn = true;
            } else {
                currentPoints.push(point);
                svg.select("g.drawing").remove();
                let g = this.drawPolygon(currentPoints, {
                    vertexColor: "yellow",
                    close: false,
                });
                g.attr("class", "drawing");
            }
        };
        let onmousemove = event => {
            if (!drawing || this.mode != "draw") return;
            let tx = this.transX();
            let ty = this.transY();
            let itx = this.invertTransX();
            let ity = this.invertTransY();
            let cursor = d3.pointer(event);
            let point = [itx(cursor[0]), ity(cursor[1])];
            let g = this.canvas.select("g.drawing");
            g.select("line").remove();
            g.insert("line", ":first-child")
                .attr("x1", tx(lastDrawPoint[0]))
                .attr("y1", ty(lastDrawPoint[1]))
                .attr("x2", tx(point[0]))
                .attr("y2", ty(point[1]))
                .attr("stroke", "#53DBF3")
                .attr("stroke-width", 1);
        };

        this.zoom = d3.zoom().scaleExtent([0.2, 50]).on("zoom", zoomed);
        this.pointDragger = d3
            .drag()
            .on("drag", function (event) {
                ondrag(this, event);
            })
            .on("end", () => (dragging = false));
        svg.on("mouseup", onmouseup);
        svg.on("mousemove", onmousemove);
        svg.call(this.zoom);

        this.drawn = false;
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

    setMode(mode) {
        switch (mode) {
            case "move":
                this.mode = mode;
                this.svg.call(this.zoom);
                break;
            case "draw":
                this.mode = mode;
                this.drawn = false;
                this.svg.on(".zoom", null);
                break;
            case "fixed":
                this.mode = mode;
                this.svg.on(".zoom", null);
                break;
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

    removeAllShapes() {
        this.removeShape("polygon");
        this.removeShape("lines");
    }

    removeShape(className) {
        this.canvas.selectAll(`g.${className}`).remove();
    }

    drawPolygon(points, config) {
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
        let g = this.canvas.append("g").attr("class", "polygon");
        if (c.close) {
            g.append("polygon").data([points]).style("fill", c.color);
        } else {
            g.append("polyline").data([points]).style("fill", "none").attr("stroke", "#000");
        }

        let circles = g
            .selectAll("circle")
            .data(points)
            .join("circle")
            .attr("r", c.vertexSize)
            .attr("fill", c.vertexColor)
            .attr("stroke", "#000");
        if (c.close && !c.fixed) {
            circles.style("cursor", "move").call(this.pointDragger);
        } else if (!c.close) {
            circles.attr("is-handle", true).style("cursor", "pointer");
        }

        this.applyTransform();
        return g;
    }

    drawLines(lines, lineColor = "#FDBC07") {
        this.removeShape("lines");
        let g = this.canvas.append("g").attr("class", "lines");
        g.selectAll("line")
            .data(lines)
            .join("line")
            .attr("x1", d => d[0][0])
            .attr("y1", d => d[0][1])
            .attr("x2", d => d[1][0])
            .attr("y2", d => d[1][1])
            .attr("stroke", lineColor)
            .attr("stroke-width", 1);
        this.applyTransform();
        return g;
    }
}

export function getRandomColor() {
    let r, g, b;
    while (true) {
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
        if (r + g + b < 224 * 3) break;
    }
    return `rgba(${r},${g},${b},0.5)`;
}
