import * as SP from "simple-polygon-wasm";
import $ from "jquery";
import { Draw, getRandomColor } from "./draw.js";

var draw = new Draw();
var points = [];

function drawPolygon() {
    draw.removeAllShapes();
}

function randomPolygon(opts, config) {
    points = SP.gen_polygon();
    console.log(points);
    draw.removeAllShapes();
    if(!opts){
        draw.drawPolygon(points, { color: getRandomColor(), vertexSize: 5 });
    }else{
        draw.drawPolygon(points, { color: config.color, vertexSize: config.vertexSize }); 
    }
    draw.autoScale(points);
    $("#adv-btn").removeClass("disabled");
}

function loadPolygon() {}

$(() => {
    $("#move-btn").on("click", () => {
        $("#move-btn").addClass("active");
        $("#polygon-btn").removeClass("active");
        $("#adv-btn").removeClass("active");
        $("#path-opts").removeClass("visually-hidden");
        $("#cfg-opts").children().each(function(){
            $(this).addClass("visually-hidden");
        });
        draw.setMode("move");
    });
    document.getElementById("polygon-btn").addEventListener("hidden.bs.dropdown", () => {
        $("#move-btn").removeClass("active");
        $("#polygon-btn").addClass("active");
        $("#adv-btn").removeClass("active");
        $("#adv-btn").addClass("disabled");
        switch ($("#polygon-btn").attr("mode")) {
            case "draw":
                draw.setMode("draw");
                drawPolygon();
                break;
            case "random":
                draw.setMode("fixed");
                randomPolygon(false, {});
                break;
            case "load":
                draw.setMode("fixed");
                loadPolygon();
                break;
        }
    });
    $("#adv-btn").on("click", () => {
        $("#move-btn").removeClass("active");
        $("#polygon-btn").removeClass("active");
        $("#adv-btn").addClass("active");
        $("#path-opts").removeClass("visually-hidden");
        $("#cfg-opts").children().each(function(){
            $(this).addClass("visually-hidden");
        });
    });
    $("#tri-btn").on("click",() => {
        let diagonals = SP.triangulation(points, "mono_partition");
        console.log(diagonals);
        draw.drawLines(diagonals.map(d => [points[d[0]], points[d[1]]]));
        let path = SP.find_shortest_path(points, [91, 104], [119, 119], "mono_partition");
        console.log(path);
    });

    $("#draw-btn").on("click", () => {
        $("#polygon-btn").attr("mode", "draw").text("Draw");
        $("#path-opts").addClass("visually-hidden");
        var childs = $("#cfg-opts").children();
        childs.eq(0).removeClass("visually-hidden");
        childs.eq(1).removeClass("visually-hidden");
        for( var i = 2; i < 6; i++){
            childs.eq(i).addClass("visually-hidden");
        }
    });
    $("#random-btn").on("click", () => {
        $("#polygon-btn").attr("mode", "random").text("Random");
        $("#path-opts").addClass("visually-hidden");
        $("#cfg-opts").children().each(function(){
            $(this).removeClass("visually-hidden");
        });
    });
    $("#load-btn").on("click", () => {
        $("#polygon-btn").attr("mode", "load").text("Load from...");
        $("#path-opts").addClass("visually-hidden");
        var childs = $("#cfg-opts").children();
        childs.eq(0).removeClass("visually-hidden");
        childs.eq(1).removeClass("visually-hidden");
        childs.eq(5).removeClass("visually-hidden");
        for( var i = 2; i < 5; i++){
            childs.eq(i).addClass("visually-hidden");
        }
        // TODO: need size and color to gen
    });
    $("#clear-btn").on("click",() =>{
        draw.removeAllShapes();
    });
    $("#gen-btn").on("click",()=>{
        // TODO: algorithm choice
        randomPolygon(true, {color: $("#pick-color").val(), vertexSize: $("#pick-size").val()});
    });


});
