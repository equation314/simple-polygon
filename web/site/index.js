import * as SP from "simple-polygon-wasm";
import $ from "jquery";
import { Draw, getRandomColor } from "./draw.js";

var draw = new Draw();
var points = [];

function drawPolygon() {
    draw.removeAllShapes();
}

function randomPolygon() {
    points = SP.gen_polygon();
    console.log(points);
    draw.removeAllShapes();
    draw.drawPolygon(points, { color: getRandomColor(), vertexSize: 3 });
    draw.autoScale(points);
    $("#path-btn").removeClass("disabled");
}

function loadPolygon() {}

$(() => {
    $("#move-btn").on("click", () => {
        $("#move-btn").addClass("active");
        $("#polygon-btn").removeClass("active");
        $("#path-btn").removeClass("active");
        $("#right-opts").children().each(function(){
            $(this).addClass("visually-hidden");
        });
        draw.setMode("move");
    });
    document.getElementById("polygon-btn").addEventListener("hidden.bs.dropdown", () => {
        $("#move-btn").removeClass("active");
        $("#polygon-btn").addClass("active");
        $("#path-btn").removeClass("active");
        $("#path-btn").addClass("disabled");
        switch ($("#polygon-btn").attr("mode")) {
            case "draw":
                draw.setMode("draw");
                drawPolygon();
                break;
            case "random":
                draw.setMode("fixed");
                randomPolygon();
                break;
            case "load":
                draw.setMode("fixed");
                loadPolygon();
                break;
        }
    });
    $("#path-btn").on("click", () => {
        $("#move-btn").removeClass("active");
        $("#polygon-btn").removeClass("active");
        $("#path-btn").addClass("active");
        let diagonals = SP.triangulation(points, "mono_partition");
        console.log(diagonals);
        draw.drawLines(diagonals.map(d => [points[d[0]], points[d[1]]]));

        let path = SP.find_shortest_path(points, [91, 104], [119, 119], "mono_partition");
        console.log(path);
    });
    $("#draw-btn").on("click", () => {
        $("#polygon-btn").attr("mode", "draw").text("Draw");
        $("#right-opts li").eq(0).removeClass("visually-hidden");
        $("#right-opts li").eq(1).removeClass("visually-hidden");
        for( var i = 2; i < 5; i++){
            $("#right-opts li").eq(i).addClass("visually-hidden");
        }
    });
    $("#random-btn").on("click", () => {
        $("#polygon-btn").attr("mode", "random").text("Random");
        $("#right-opts").children().each(function(){
            $(this).removeClass("visually-hidden");
        });
    });
    $("#load-btn").on("click", () => {
        $("#polygon-btn").attr("mode", "load").text("Load from...");
    });
    $("#clear-btn").on("click",() =>{
        draw.removeAllShapes();
        $("#right-opts").children().each(function(){
            $(this).addClass("visually-hidden");
        });
    });
});
