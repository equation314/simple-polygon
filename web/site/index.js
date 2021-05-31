import * as SP from "simple-polygon-wasm";
import { drawPolygon, drawLines } from "./draw.js";

function scale(points) {
    return points.map((p) => [p[0] * 10 - 600, p[1] * 10 - 800]);
}

let points = SP.gen_polygon();
let pointsScale = scale(points);
console.log(points);
drawPolygon(pointsScale, { color: "green", vertexSize: 3 });

let diagonals = SP.triangulation(points, "mono_partition");
console.log(diagonals);
drawLines(diagonals.map((d) => [pointsScale[d[0]], pointsScale[d[1]]]));

let path = SP.find_shortest_path(points, [91, 104], [119, 119], "mono_partition");
console.log(path);
