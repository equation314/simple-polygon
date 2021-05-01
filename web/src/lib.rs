use simple_polygon_core as sp;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello {}, {}!", name, sp::hello()));
}

#[wasm_bindgen]
pub fn gen_polygon() -> JsValue {
    let polygon = sp::gen_polygon();
    JsValue::from_serde(&polygon).unwrap()
}
