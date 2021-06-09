import * as SP from "simple-polygon-wasm";
import $ from "jquery";
import { Draw, getRandomColor } from "./draw.js";

var draw = new Draw();
draw.onPolygonDrawn(points => {
    console.log(points);
    $("#tri-btn").removeClass("disabled");
    $("#path-btn").removeClass("disabled");
});
draw.onPolygonDestroyed(() => {
    $("#tri-btn").addClass("disabled");
    $("#path-btn").addClass("disabled");
});

function randomPolygon(n, algo) {
    let points = SP.gen_polygon(n, algo);
    console.log(n, algo, points);
    console.log(SP.is_ccw(points));
    console.log(SP.is_simple_polygon(points));
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

$(() => {
    $("#polygon-btn").on("change", () => {
        switch ($("#polygon-btn").val()) {
            case "draw":
                $("#move-btn").removeClass("active");
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
        if (draw.existLines(triClassname)) {
            draw.hideLines(triClassname);
        } else {
            let points = draw.getCurrentPolygon();
            if (!SP.is_simple_polygon(points)) {
                showError("Not a simple polygon!");
                return;
            }
            if (!SP.is_ccw(points)) {
                points.reverse();
            }
            let diagonals = SP.triangulation(points, "mono_partition");
            draw.drawLines(
                diagonals.map(d => [points[d[0]], points[d[1]]]),
                "#9c3829",
                triClassname,
            );
        }
    });
    $("#path-btn").on("click", () => {
        let pathClassname = "path-lines";
        if (draw.existLines(pathClassname)) {
            draw.hideLines(pathClassname);
        } else if (draw.hasTwoPoints()) {
            let points = draw.getCurrentPolygon();
            if (!SP.is_simple_polygon(points)) {
                showError("Not a simple polygon!");
                return;
            }
            if (!SP.is_ccw(points)) {
                points.reverse();
            }

            let endpoints = draw.getTwoPoints();
            console.log(endpoints);
            //TODO :transform back
            let path = SP.find_shortest_path(points, endpoints[0], endpoints[1], "mono_partition");
            console.log(path);
            let k = [];
            if (path == null) return;
            else if (path.length == 0) k.push([endpoints[0], endpoints[1]]);
            else {
                path.forEach(function (item, index) {
                    if (index != path.length - 1) {
                        k.push([points[item], points[path[index + 1]]]);
                    }
                });
                k.unshift([endpoints[0], points[path[0]]]);
                k.push([points[path[path.length - 1]], endpoints[1]]);
            }
            draw.drawLines(k, "#2c507b", pathClassname);
        }
    });
    // $("#point-btn").on("click", () => {
    //     draw.setMode("draw-points");
    //     //draw.drawPoints([[91, 104], [119, 119]]);
    // });

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

    $("#move-btn").on("click", () => {
        draw.setMode($("#move-btn").hasClass("active") ? "move" : "draw-polygon");
    });
    $("#clear-btn").on("click", () => {
        draw.clearCanvas();
    });
    $("#gen-btn").on("click", () => {
        randomPolygon($("#pick-size").val(), $("#algo-btn").val());
    });
});
