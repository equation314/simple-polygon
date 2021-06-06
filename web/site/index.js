import * as SP from "simple-polygon-wasm";
import { drawPolygon, drawLines } from "./draw.js";

let points = SP.gen_polygon();
console.log(points);
drawPolygon(points, { color: "#00FF0077", vertexSize: 3, fixed: false });

let diagonals = SP.triangulation(points, "mono_partition");
console.log(diagonals);
drawLines(diagonals.map(d => [points[d[0]], points[d[1]]]));

let path = SP.find_shortest_path(points, [91, 104], [119, 119], "mono_partition");
console.log(path);
