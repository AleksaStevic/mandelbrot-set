use crate::config::CANVAS_SIZE;
use crate::vector::Vec2;
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

pub const BACKGROUND_COLOR: &str = "#99B2DD";

pub fn draw_dot(center: &Vec2, color: &str, ctx: &CanvasRenderingContext2d) {
    let Vec2(x, y) = center;
    ctx.set_fill_style(&JsValue::from_str(color));
    ctx.fill_rect((*x).floor(), (*y).floor(), 1.0, 1.0);
}

pub fn clear(ctx: &CanvasRenderingContext2d) {
    let (width, height) = CANVAS_SIZE;
    ctx.set_fill_style(&JsValue::from_str(BACKGROUND_COLOR));
    ctx.fill_rect(0.0, 0.0, width, height);
}
