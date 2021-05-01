import * as SP from "simple-polygon-wasm";
import { drawPolygon } from "./draw.js";

let points = SP.gen_polygon().map((p) => [p.x, p.y]);
console.log(points);
drawPolygon(points, { color: "green", vertexSize: 3 });
