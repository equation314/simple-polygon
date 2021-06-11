import * as SP from "simple-polygon-wasm";
import $ from "jquery";
import { Draw, getRandomColor } from "./draw.js";

const DIAGONAL_COLOR = "#9c3829";
const PATH_COLOR = "#2c507b";

var draw = new Draw();
draw.onPolygonDrawn(points => {
    $("#tri-btn").removeClass("disabled");
    $("#path-btn").removeClass("disabled");
});
draw.onPolygonDestroyed(() => {
    $("#tri-btn").addClass("disabled");
    $("#path-btn").addClass("disabled");
});
draw.onEndpointsDrawn(points => showShortestPath(points[0], points[1]));

function maxPolygonSize(algo) {
    return {
        growth: 1000,
        space: 1000,
        "2opt": 200,
        permute: 10,
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
    draw.drawPolygon(points, { color: getRandomColor(), vertexSize: 3 });
    draw.autoScale(points);
}

function loadPolygon() {
    document.getElementById("file-opt").click();
    var file = $("#file-opt")[0].files;
    var reader = new FileReader();
    reader.readAsText(file[0], "UTF-8"); //read file
    reader.onload = function (e) {
        var fileString = e.target.result; // read content
        console.log("file content is", fileString);
    };
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
                $("#draw-opts").show();
                $("#gen-opts").hide();
                draw.setMode("draw-polygon");
                draw.clearCanvas();
                break;
            case "random":
                $("#draw-opts").hide();
                $("#gen-opts").show();
                draw.setMode("move");
                draw.clearCanvas();
                break;
            case "load":
                $("#draw-opts").hide();
                $("#gen-opts").hide();
                draw.setMode("move");
                loadPolygon();
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
            draw.setMode("draw-points");
        }
    });

    $("#algo-btn")
        .next()
        .children()
        .on("click", function (e) {
            let target = $(e.target);
            $("#algo-btn").val(target.val()).text(target.text());
        });
    $("#polygon-btn")
        .next()
        .children()
        .on("click", function (e) {
            let target = $(e.target);
            if (target.val() != $("#polygon-btn").val()) {
                $("#polygon-btn").val(target.val()).text(target.text()).trigger("change");
            }
        });

    $("#clear-btn").on("click", () => {
        draw.clearCanvas();
        draw.setMode("draw-polygon");
    });
    $("#gen-btn").on("click", () => {
        randomPolygon($("#pick-size").val(), $("#algo-btn").val());
    });
});
