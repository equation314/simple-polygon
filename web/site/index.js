import * as SP from "simple-polygon-wasm";
import $ from "jquery";
import { Draw } from "./draw.js";

const DIAGONAL_COLOR = "#9c3829";
const PATH_COLOR = "#2c507b";

var draw = new Draw();
draw.onPolygonDrawn(points => {
    $("#tri-btn").removeClass("disabled");
    $("#path-btn").removeClass("disabled");
    $("#export-btn").removeClass("disabled");
});
draw.onPolygonDestroyed(() => {
    $("#tri-btn").addClass("disabled");
    $("#path-btn").addClass("disabled");
    $("#export-btn").addClass("disabled");
});
draw.onEndpointsDrawn(points => showShortestPath(points[0], points[1]));

function randomColor() {
    let r, g, b;
    while (true) {
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
        if (r + g + b < 224 * 3) break;
    }
    return `rgba(${r},${g},${b},0.5)`;
}

function pickedColor() {
    return $("#pick-color").val() + "77";
}

function maxPolygonSize(algo) {
    return {
        growth: 1000,
        space: 1000,
        "2opt": 200,
        permute: 15,
    }[algo];
}

function randomPolygon(n, algo) {
    if (n < 3) {
        showError(`Too few vertices for generation: ${n} < 3`);
        return;
    }
    if (n > maxPolygonSize(algo)) {
        showError(
            `Too many vertices for the ${$("#algo-btn").text()} algorithm: \
            ${n} > ${maxPolygonSize(algo)}`,
        );
        return;
    }
    let points = SP.gen_polygon(n, 100, algo);
    console.log(n, algo, points);
    draw.clearCanvas();
    draw.drawPolygon(points, { color: randomColor(), vertexSize: 3 });
    draw.autoScale(points);
}

function loadPolygon() {
    let input = $("#file-opt")[0];
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = function (e) {
        let content = e.target.result;
        let points = [];
        for (let line of content.split("\n")) {
            let p = line.trim().split(/\s+/);
            if (p == "") {
                continue;
            } else if (p.length == 2) {
                let point = [parseFloat(p[0]), parseFloat(p[1])];
                if (isNaN(point[0]) || isNaN(point[1])) {
                    showError("Invalid polygon file format!");
                    return;
                }
                points.push(point);
            } else {
                showError("Invalid polygon file format!");
                return;
            }
        }
        draw.clearCanvas();
        draw.drawPolygon(points, { color: pickedColor("#pick-color"), vertexSize: 3 });
        draw.autoScale(points);
    };
    input.value = null;
}

function exportPolygon() {
    let points = draw.getCurrentPolygon();
    if (!SP.is_ccw(points)) {
        points.reverse();
    }
    let context = points.map(p => p.join(" ")).join("\n");
    let link = document.getElementById("export-link");
    let blob = new Blob([context], { type: "text/plain" });
    link.href = URL.createObjectURL(blob);
    link.download = "polygon.pts";
    link.click();
}

function showError(message) {
    let alert = $("#alert");
    alert.text(message);
    alert.slideDown("slow", () => setTimeout(() => alert.slideUp("slow"), 1000));
}

function showTriangulation() {
    let points = draw.getCurrentPolygon();
    if (!SP.is_simple_polygon(points)) {
        showError("Not a simple polygon!");
        return;
    }
    if (!SP.is_ccw(points)) {
        points.reverse();
    }
    let diagonals = SP.triangulation(points, "mono_partition");
    let lines = diagonals.map(d => [points[d[0]], points[d[1]]]);
    draw.drawLines(lines, DIAGONAL_COLOR, "tri-lines");
}

function showShortestPath(start, end) {
    let points = draw.getCurrentPolygon();
    if (!SP.is_simple_polygon(points)) {
        showError("Not a simple polygon!");
        return;
    }
    if (!SP.is_ccw(points)) {
        points.reverse();
    }

    let pathIdx = SP.find_shortest_path(points, start, end, "mono_partition");
    if (pathIdx == null) {
        showError("Unreachable!");
        return;
    }
    let path = Array.prototype.concat(
        [start],
        pathIdx.map(idx => points[idx]),
        [end],
    );

    let lines = [];
    for (let i = 0; i < path.length - 1; i++) {
        lines.push([path[i], path[i + 1]]);
    }
    draw.drawLines(lines, PATH_COLOR, "path-lines");
}

$(() => {
    $("#polygon-btn").on("change", () => {
        switch ($("#polygon-btn").val()) {
            case "draw":
                $("#color-opts").show();
                $("#clear-opts").show();
                $("#gen-opts").hide();
                draw.setMode("draw-polygon");
                draw.clearCanvas();
                break;
            case "random":
                $("#color-opts").hide();
                $("#clear-opts").hide();
                $("#gen-opts").show();
                draw.setMode("move");
                draw.clearCanvas();
                break;
            case "load":
                $("#color-opts").show();
                $("#clear-opts").hide();
                $("#gen-opts").hide();
                draw.setMode("move");
                break;
        }
    });

    $("#tri-btn").on("click", () => {
        let triClassname = "tri-lines";
        if (draw.hasShape(triClassname)) {
            draw.toggleShape(triClassname);
        } else {
            showTriangulation();
        }
    });
    $("#path-btn").on("click", () => {
        let pathClassname = "path-lines";
        if (draw.hasShape(pathClassname)) {
            draw.toggleShape(pathClassname);
        } else if (draw.currentEndpoints.length) {
            showShortestPath(draw.currentEndpoints[0], draw.currentEndpoints[1]);
        } else {
            let points = draw.getCurrentPolygon();
            if (!SP.is_simple_polygon(points)) {
                showError("Not a simple polygon!");
            } else {
                draw.setMode("draw-points");
            }
        }
    });
    $("#load-btn").on("click", () => document.getElementById("file-opt").click());
    $("#export-btn").on("click", exportPolygon);
    $("#file-opt").on("change", loadPolygon);

    $("#algo-btn")
        .next()
        .children()
        .on("click", function (e) {
            let target = $(e.target);
            $("#algo-btn").val(target.val()).text(target.text());
        });
    $("#polygon-btn")
        .next()
        .find("li > button.switch-mode")
        .on("click", function (e) {
            let target = $(e.target);
            if (target.val() != $("#polygon-btn").val()) {
                $("#polygon-btn").val(target.val()).text(target.text()).trigger("change");
            }
        });

    $("#pick-color").on("change", () => {
        draw.setShapeStyle("polygon-drawn", "polyline", "fill", pickedColor());
    });
    $("#clear-btn").on("click", () => {
        draw.clearCanvas();
        draw.setMode("draw-polygon");
    });
    $("#gen-btn").on("click", () => {
        randomPolygon($("#pick-size").val(), $("#algo-btn").val());
    });
});
