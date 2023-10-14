use crate::vector::Vec2;
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

pub const CANVAS_SIZE: Vec2 = Vec2(1024.0, 1024.0);

pub const BACKGROUND_COLOR: &str = "#99B2DD";

pub fn draw_dot_color_lch(center: &Vec2, color: (f64, f64, f64), ctx: &CanvasRenderingContext2d) {
    let Vec2(x, y) = center;
    ctx.set_fill_style(&JsValue::from_str(&format!(
        "lch({}%,{},{})",
        color.0, color.1, color.2
    )));
    ctx.fill_rect((*x).floor(), (*y).floor(), 1.0, 1.0);
}

pub fn clear(ctx: &CanvasRenderingContext2d) {
    let Vec2(width, height) = CANVAS_SIZE;
    ctx.set_fill_style(&JsValue::from_str(BACKGROUND_COLOR));
    ctx.fill_rect(0.0, 0.0, width, height);
}
