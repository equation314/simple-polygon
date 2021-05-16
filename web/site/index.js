import * as SP from "simple-polygon-wasm";
import { drawPolygon } from "./draw.js";

let points = SP.gen_polygon().points.map((p) => [p.x * 4, p.y * 4]);
console.log(points);
drawPolygon(points, { color: "green", vertexSize: 3 });
