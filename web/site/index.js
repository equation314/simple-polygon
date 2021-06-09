import * as SP from "simple-polygon-wasm";
import $ from "jquery";
import { Draw, getRandomColor } from "./draw.js";

var draw = new Draw();

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
    $("#move-btn").on("click", () => {
        $("#move-btn").addClass("active");
        $("#polygon-btn").removeClass("active");
        $("#adv-btn").removeClass("active");
        $("#draw-opts").hide();
        $("#gen-opts").hide();
        $("#adv-opts").hide();
        draw.setMode("move");
    });
    document.getElementById("polygon-btn").addEventListener("hidden.bs.dropdown", () => {
        $("#move-btn").removeClass("active");
        $("#polygon-btn").addClass("active");
        $("#adv-btn").removeClass("active");
        $("#adv-opts").hide();
        switch ($("#polygon-btn").val()) {
            case "draw":
                $("#draw-opts").show();
                $("#gen-opts").hide();
                draw.setMode("draw-polygon");
                break;
            case "random":
                $("#draw-opts").hide();
                $("#gen-opts").show();
                draw.setMode("fixed");
                break;
            case "load":
                $("#draw-opts").hide();
                $("#gen-opts").hide();
                draw.setMode("fixed");
                loadPolygon();
                break;
        }
    });
    $("#adv-btn").on("click", () => {
        $("#move-btn").removeClass("active");
        $("#polygon-btn").removeClass("active");
        $("#adv-btn").addClass("active");
        $("#draw-opts").hide();
        $("#gen-opts").hide();
        $("#adv-opts").show();
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
            $("#polygon-btn").val(target.val()).text(target.text());
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
    $("#point-btn").on("click", () => {
        draw.setMode("draw-points");
        //draw.drawPoints([[91, 104], [119, 119]]);
    });

    $("#clear-btn").on("click", () => {
        draw.clearCanvas();
    });
    $("#gen-btn").on("click", () => {
        // TODO: algorithm choice
        randomPolygon($("#pick-size").val(), $("#algo-btn").val());
    });
});
