import * as SP from "simple-polygon-wasm";
import $ from "jquery";
import { checkSimplePolygon, draw, showError } from "./index.js";

const DIAGONAL_COLOR = "#ce6a5b";
const BOUNDARY_COLOR = "#777";
const FUNNEL_COLOR = "#000";
const PATH_COLOR = "#2c507b";
const CUSP_POINT_COLOR = "green";
const CURRENT_POINT_COLOR = "red";

var gSteppingAlgorithm = "shortest";
var gSteppingResult = null;
var gCurrentStep = 0;
var gMaxStep = 0;
var gIsPlaying = false;

function showOneStep(step) {
    if (gSteppingAlgorithm == "path") {
        if (step == 0) {
            draw.removeShape("stepping");
            draw.drawLines(
                gSteppingResult.sleeve_diagonals,
                { color: DIAGONAL_COLOR },
                "stepping all-steps",
            );
            draw.drawLines(
                gSteppingResult.sleeve_boundary,
                { color: BOUNDARY_COLOR },
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
    let points = draw.getCurrentPolygon();
    checkSimplePolygon(points);

    gSteppingAlgorithm = algo;
    if (algo == "path") {
        let [start, end] = draw.getCurrentEndpoints();
        gSteppingResult = SP.find_shortest_path(points, start, end, "mono_partition", true);
        if (gSteppingResult == null) {
            showError("Unreachable!");
            return false;
        }
        gCurrentStep = 0;
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
