mod config;
mod coords;
mod events;
mod mandelbrot;
mod render;
mod utils;
mod vector;

#[macro_use]
extern crate impl_ops;

use config::{CANVAS_ID, CANVAS_SIZE};
use mandelbrot::draw_rect;
use render::clear;
use vector::Vec2;
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
pub fn draw(ctx: &CanvasRenderingContext2d) -> Result<(), JsValue> {
    clear(ctx);
    let mut image_data = ctx.create_image_data_with_sw_and_sh(CANVAS_SIZE.0, CANVAS_SIZE.1)?;
    draw_rect(
        (0, 0),
        (CANVAS_SIZE.0 as i32, CANVAS_SIZE.1 as i32),
        (None, None, None, None),
        &ctx,
        &mut image_data,
    );

    Ok(())
}

#[wasm_bindgen]
pub fn main() {
    let window = web_sys::window().expect("Window object does not exist.");
    let document = window.document().expect("Document does not exist.");
    let canvas = document
        .get_element_by_id(CANVAS_ID)
        .expect("Canvas does not exist.");
    let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

    let ctx = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();

    canvas.set_width(CANVAS_SIZE.0 as u32);
    canvas.set_height(CANVAS_SIZE.1 as u32);

    draw(&ctx);
}

// fn bind_listeners(document: &Document) -> Result<(), _> {
//     let a = Closure::<dyn Fn()>::new(move || console_log!("hello"));
//     document.add_event_listener_with_callback("keyup", a.as_ref().unchecked_ref());
//     a.forget();

//     Ok(())
// }
