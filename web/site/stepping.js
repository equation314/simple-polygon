import * as SP from "simple-polygon-wasm";
import $ from "jquery";
import { checkSimplePolygon, draw, showError, gLastRandomPolygonState } from "./index.js";

const DIAGONAL_COLOR = "#ce6a5b";
const BOUNDARY_COLOR = "#333";
const FUNNEL_COLOR = "#000";
const PATH_COLOR = "#3159E4";
const CUSP_POINT_COLOR = "green";
const CURRENT_POINT_COLOR = "red";

const TWO_OPT_EDGES_COLOR = "#9c3829";
const TWO_OPT_POINT_COLOR = "red";

var gSteppingAlgorithm = "shortest";
var gSteppingResult = null;
var gCurrentStep = 0;
var gMaxStep = 0;
var gIsPlaying = false;

var gCurrentPolygonColor = undefined;
var gSavedPolygon = [];

function showOneStep(step) {
    if (gSteppingAlgorithm == "2opt") {
        let points = gSteppingResult.steps[step - (step % 2)].poly;
        draw.removeShape("stepping");
        draw.drawPolygon(
            points,
            { color: gCurrentPolygonColor, vertexSize: points.length > 200 ? 0 : 2 },
            "stepping step-polygon",
        );
        if (step % 2 == 1) {
            let data = gSteppingResult.steps[step];
            draw.drawLines(
                [data.e0, data.e1],
                { color: TWO_OPT_EDGES_COLOR },
                "stepping step-edges",
            );
            draw.drawLines(
                [
                    [data.e0[0], data.e1[0]],
                    [data.e0[1], data.e1[1]],
                ],
                { color: TWO_OPT_EDGES_COLOR, dashed: true },
                "stepping step-edges",
            );
            for (let i = 0; i < 2; i++) {
                draw.drawPoint(
                    data.e0[i],
                    { color: TWO_OPT_POINT_COLOR, size: 3 },
                    "stepping step-point",
                );
                draw.drawPoint(
                    data.e1[i],
                    { color: TWO_OPT_POINT_COLOR, size: 3 },
                    "stepping step-point",
                );
            }
        }
    } else if (gSteppingAlgorithm == "path") {
        if (step == 0) {
            draw.removeShape("stepping");
            draw.drawLines(
                gSteppingResult.sleeve_diagonals,
                { color: DIAGONAL_COLOR, width: 0.5 },
                "stepping all-steps",
            );
            draw.drawLines(
                gSteppingResult.sleeve_boundary,
                { color: BOUNDARY_COLOR, width: 0.5 },
                "stepping all-steps",
            );
        } else {
            draw.removeShape("one-step");
        }
        let data = gSteppingResult.steps[step];
        draw.drawPath(data.left_chain, { color: FUNNEL_COLOR, width: 2 }, "stepping one-step");
        draw.drawPath(data.right_chain, { color: FUNNEL_COLOR, width: 2 }, "stepping one-step");
        draw.drawPath(data.path, { color: PATH_COLOR, width: 2 }, "stepping one-step");
        draw.drawPoint(data.cusp, { color: CUSP_POINT_COLOR }, "stepping one-step");
        draw.drawPoint(data.current, { color: CURRENT_POINT_COLOR }, "stepping one-step");
        if (data.tangent != null) {
            draw.drawLines(
                [[data.tangent, data.current]],
                { color: PATH_COLOR, dashed: true, width: 2 },
                "stepping one-step",
            );
        }
    } else if (gSteppingAlgorithm == "tri") {
    }
}

function showSteppingResult(algo) {
    gCurrentStep = 0;
    gSteppingAlgorithm = algo;
    if (algo == "2opt") {
        let [n, range, seed] = gLastRandomPolygonState;
        gSteppingResult = SP.gen_polygon(n, range, algo, seed, true);
        if (gSteppingResult == null) {
            return false;
        }
        gMaxStep = gSteppingResult.steps.length - 1;
        gSavedPolygon = draw.getCurrentPolygon();
        gCurrentPolygonColor = draw.getShapeStyle("polyline", "polygon", "fill");
        draw.removeShape("polygon");
        draw.clearEndpoints();
        console.log(algo, gMaxStep, gCurrentPolygonColor, gSteppingResult);

        draw.clearAlgorithmResult();
        showOneStep(0);
        return true;
    } else if (algo == "path") {
        let points = draw.getCurrentPolygon();
        if (!checkSimplePolygon(points)) {
            return;
        }
        let [start, end] = draw.getCurrentEndpoints();
        gSteppingResult = SP.find_shortest_path(points, start, end, "mono_partition", true);
        if (gSteppingResult == null) {
            showError("Unreachable!");
            return false;
        }
        gMaxStep = gSteppingResult.steps.length - 1;
        console.log(algo, gMaxStep, gSteppingResult);

        draw.clearAlgorithmResult();
        showOneStep(0);
        return true;
    } else if (algo == "tri") {
        return false;
    }
}

export function init() {
    $("#step-btn")
        .next()
        .find("li > button")
        .on("click", function (e) {
            let target = $(e.target);
            if (showSteppingResult(target.val())) {
                $("#polygon-btn").prop("disabled", true);
                $("#tri-btn").prop("disabled", true);
                $("#path-btn").prop("disabled", true);
                $("#color-opts").hide();
                $("#clear-opts").hide();
                $("#gen-opts").hide();
                $("#step-opts").show();
                $("#step-prev-btn").prop("disabled", true);
                $("#step-next-btn").prop("disabled", false);
                $("#step-btn-div").hide();
                $("#stop-btn-div").show();
                draw.setMode("fixed");
            }
        });
    $("#stop-btn").on("click", () => {
        gIsPlaying = false;
        $("#polygon-btn").prop("disabled", false);
        $("#tri-btn").prop("disabled", false);
        $("#path-btn").prop("disabled", false);
        $("#step-opts").hide();
        $("#stop-btn-div").hide();
        $("#step-btn-div").show();
        switch ($("#polygon-btn").val()) {
            case "draw":
                $("#color-opts").show();
                $("#clear-opts").show();
                break;
            case "random":
                $("#gen-opts").show();
                break;
            case "load":
                $("#color-opts").show();
                break;
        }
        draw.removeShape("stepping");
        draw.setMode("move");
        if (["2opt", "space"].includes(gSteppingAlgorithm)) {
            draw.drawPolygon(gSavedPolygon, {
                color: gCurrentPolygonColor,
                vertexSize: gSavedPolygon.length > 200 ? 0 : 2,
            });
        }
    });

    $("#step-first-btn").on("click", () => {
        gCurrentStep = 0;
        showOneStep(gCurrentStep);
        $("#step-prev-btn").prop("disabled", true);
        $("#step-next-btn").prop("disabled", false);
    });
    $("#step-last-btn").on("click", () => {
        gCurrentStep = gMaxStep;
        showOneStep(gCurrentStep);
        $("#step-prev-btn").prop("disabled", false);
        $("#step-next-btn").prop("disabled", true);
    });
    $("#step-prev-btn").on("click", () => {
        if (gCurrentStep == 0) {
            return;
        }
        if (--gCurrentStep == 0) {
            $("#step-prev-btn").prop("disabled", true);
        }
        $("#step-next-btn").prop("disabled", false);
        showOneStep(gCurrentStep);
    });
    $("#step-next-btn").on("click", () => {
        if (gCurrentStep >= gMaxStep) {
            return;
        }
        if (++gCurrentStep == gMaxStep) {
            $("#step-next-btn").prop("disabled", true);
        }
        $("#step-prev-btn").prop("disabled", false);
        showOneStep(gCurrentStep);
    });

    let play = () => {
        if (gIsPlaying && gCurrentStep < gMaxStep) {
            $("#step-next-btn").trigger("click");
            setTimeout(play, 100);
        } else {
            gIsPlaying = false;
            $("#step-play-btn").text("Play");
        }
    };
    $("#step-play-btn").on("click", () => {
        if (!gIsPlaying) {
            gIsPlaying = true;
            $("#step-play-btn").text("Pause");
            play();
        } else {
            gIsPlaying = false;
            $("#step-play-btn").text("Play");
        }
    });
}
