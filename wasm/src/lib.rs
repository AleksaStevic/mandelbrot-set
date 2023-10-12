mod coords;
mod mandelbrot;
mod render;
mod utils;
mod vector;

#[macro_use]
extern crate impl_ops;

use crate::vector::Vec2;
use mandelbrot::draw_rect;
use render::{clear, CANVAS_SIZE};
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

pub use coords::{to_pixel_space, to_vector_space};

#[wasm_bindgen(start)]
pub fn init() {
    utils::set_panic_hook();
}

#[wasm_bindgen(js_name = "getCanvasSize")]
pub fn canvas_size() -> Box<[JsValue]> {
    vec![JsValue::from(CANVAS_SIZE.0), JsValue::from(CANVAS_SIZE.1)].into_boxed_slice()
}

#[wasm_bindgen]
pub fn draw(ctx: &CanvasRenderingContext2d) {
    clear(ctx);
    draw_rect(0, 0, (800, 800), (None, None, None, None), &ctx);
}
