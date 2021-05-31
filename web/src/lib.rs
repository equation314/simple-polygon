use simple_polygon_core as sp;
use sp::geo::{Point, Polygon};
use sp::tri::Triangulation;
use std::convert::TryInto;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello {}!", name));
}

#[wasm_bindgen]
pub fn gen_polygon() -> JsValue {
    let poly = sp::gen::gen_polygon(10, "2opt");
    let points: Vec<[f64; 2]> = poly.points.iter().map(|p| [p.x, p.y]).collect();
    JsValue::from_serde(&points).unwrap()
}

#[wasm_bindgen]
pub fn triangulation(points: &JsValue, algo_str: Option<String>) -> JsValue {
    let points: Vec<[f64; 2]> = points.into_serde().unwrap();
    let poly = Polygon::from_slice(&points);
    if let Ok(algo) = algo_str
        .unwrap_or_else(|| "mono_partition".into())
        .as_str()
        .try_into()
    {
        let tri = Triangulation::build(&poly, algo);
        JsValue::from_serde(&tri.result().diagonals).unwrap()
    } else {
        JsValue::null()
    }
}

#[wasm_bindgen]
pub fn find_shortest_path(
    points: &JsValue,
    start: &JsValue,
    end: &JsValue,
    algo_str: Option<String>,
) -> JsValue {
    let points: Vec<[f64; 2]> = points.into_serde().unwrap();
    let start: [f64; 2] = start.into_serde().unwrap();
    let end: [f64; 2] = end.into_serde().unwrap();

    let poly = Polygon::from_slice(&points);
    if let Ok(algo) = algo_str
        .unwrap_or_else(|| "mono_partition".into())
        .as_str()
        .try_into()
    {
        let path = sp::shortest::find_shortest_path(
            &poly,
            Point::new(start[0], start[1]),
            Point::new(end[0], end[1]),
            algo,
        );
        JsValue::from_serde(&path).unwrap()
    } else {
        JsValue::null()
    }
}