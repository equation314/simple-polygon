import * as SP from "simple-polygon-wasm";
import $ from "jquery";
import { Draw, getRandomColor } from "./draw.js";

var draw = new Draw();
var points = [];

function drawPolygon() {
    draw.removeAllShapes();
}

function randomPolygon(opts, config) {
    points = SP.gen_polygon(10, "space");
    console.log(points);
    console.log(SP.is_ccw(points));
    console.log(SP.is_simple_polygon(points));
    draw.removeAllShapes();
    if (!opts) {
        draw.drawPolygon(points, { color: getRandomColor(), vertexSize: 5 });
    } else {
        draw.drawPolygon(points, { color: config.color, vertexSize: 5 });
    }
    draw.autoScale(points);
    $("#adv-btn").removeClass("disabled");
}

function loadPolygon() { }

$(() => {
    $("#move-btn").on("click", () => {
        $("#move-btn").addClass("active");
        $("#polygon-btn").removeClass("active");
        $("#adv-btn").removeClass("active");
        $("#path-opts").removeClass("visually-hidden");
        $("#cfg-opts").children().each(function () {
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
    $("#algo-btn").next().children().on("click", function (e) {
        var $target = $(e.target);
        $('#text').text($target.text())
    });

    $("#adv-btn").on("click", () => {
        $("#move-btn").removeClass("active");
        $("#polygon-btn").removeClass("active");
        $("#adv-btn").addClass("active");
        $("#path-opts").removeClass("visually-hidden");
        $("#cfg-opts").children().each(function () {
            $(this).addClass("visually-hidden");
        });
    });
    $("#tri-btn").on("click", () => {
        let triClassname = "tri-lines";
        if (draw.existLines(triClassname)) {
            draw.hideLines(triClassname);
        } else {
            let diagonals = SP.triangulation(points, "mono_partition");
            console.log(diagonals);
            draw.drawLines(diagonals.map(d => [points[d[0]], points[d[1]]]),"#9c3829",triClassname);
        }
    });



    $("#path-btn").on("click", () => {
        let pathClassname = "path-lines";
        if (draw.existLines(pathClassname)) {
            draw.hideLines(pathClassname);
        } else if(draw.hasTwoPoints()){
            let endpoints = draw.getTwoPoints()
            console.log(endpoints);
            //TODO :transform back
            let path = SP.find_shortest_path(points,endpoints[0], endpoints[1], "mono_partition");
            console.log(path);
            let k = [];
            if(path == null)
                return
            else if(path.length == 0)
                k.push([endpoints[0], endpoints[1]]);
            else{
                path.forEach(function (item,index){
                    if(index != path.length -1 ){
                        k.push([points[item],points[path[index + 1]]]);
                    }
                });
                k.unshift([endpoints[0], points[path[0]]]);
                k.push([points[path[path.length - 1]],endpoints[1]]);
            }
            draw.drawLines(k, "#2c507b" , pathClassname);

        }
    });

    $("#point-btn").on("click", () => {
        draw.removeShape("endpoints");
        draw.setMode("drawpoints");
        //draw.drawPoints([[91, 104], [119, 119]]);
    });

    $("#draw-btn").on("click", () => {
        $("#polygon-btn").attr("mode", "draw").text("Draw");
        $("#path-opts").addClass("visually-hidden");
        var childs = $("#cfg-opts").children();
        for (var i = 0; i < 7; i++) {
            if (i == 0 || i == 1 || i == 6)
                childs.eq(i).removeClass("visually-hidden");
            else
                childs.eq(i).addClass("visually-hidden");
        }
    });
    $("#random-btn").on("click", () => {
        $("#polygon-btn").attr("mode", "random").text("Random");
        $("#path-opts").addClass("visually-hidden");

        var childs = $("#cfg-opts").children();
        for (var i = 0; i < 7; i++) {
            if (i == 0 || i == 1 || i == 6)
                childs.eq(i).addClass("visually-hidden");
            else
                childs.eq(i).removeClass("visually-hidden");
        }
        // $("#cfg-opts").children().each(function(){
        //     $(this).removeClass("visually-hidden");
        // });

    });
    $("#load-btn").on("click", () => {
        $("#polygon-btn").attr("mode", "load").text("Load from...");
        $("#path-opts").addClass("visually-hidden");
        var childs = $("#cfg-opts").children();
        for (var i = 0; i < 7; i++) {
            if (i == 0 || i == 1 || i == 5)
                childs.eq(i).removeClass("visually-hidden");
            else
                childs.eq(i).addClass("visually-hidden");
        }
        document.getElementById('file-opt').click();
        var file = $("#file-opt")[0].files;
        var reader = new FileReader();
        reader.readAsText(file[0], "UTF-8");  //read file
        reader.onload = function (e) {
            var fileString = e.target.result; // read content
            console.log("file content is", fileString);
        };
    });
    $("#clear-btn").on("click", () => {
        draw.removeAllShapes();
    });
    $("#gen-btn").on("click", () => {
        // TODO: algorithm choice
        randomPolygon(true, { color: getRandomColor(), vertexNum: $("#pick-size").val() });
    });


});
