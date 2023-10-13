use crate::vector::Vec2;
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

pub const CANVAS_SIZE: Vec2 = Vec2(800.0, 800.0);

pub const BACKGROUND_COLOR: &str = "#99B2DD";

// pub fn draw_dot(center: &Vec2, ctx: &CanvasRenderingContext2d) {
//     let Vec2(x, y) = center;
//     ctx.set_fill_style(&JsValue::from_str(MANDELBROT_COLOR));
//     ctx.fill_rect((*x).floor(), (*y).floor(), 1.0, 1.0);
// }

pub fn draw_dot_color_rgb(center: &Vec2, color: (i32, i32, i32), ctx: &CanvasRenderingContext2d) {
    let Vec2(x, y) = center;
    ctx.set_fill_style(&JsValue::from_str(&format!(
        "rgb({},{},{})",
        color.0, color.1, color.2
    )));
    ctx.fill_rect((*x).floor(), (*y).floor(), 1.0, 1.0);
}

pub fn draw_dot_color_lch(center: &Vec2, color: (f64, f64, f64), ctx: &CanvasRenderingContext2d) {
    let Vec2(x, y) = center;
    ctx.set_fill_style(&JsValue::from_str(&format!(
        "lch({}%,{},{})",
        color.0, color.1, color.2
    )));
    ctx.fill_rect((*x).floor(), (*y).floor(), 1.0, 1.0);
}

pub fn draw_dot_color_hsl(center: &Vec2, color: (f64, f64, f64), ctx: &CanvasRenderingContext2d) {
    let Vec2(x, y) = center;
    ctx.set_fill_style(&JsValue::from_str(&format!(
        "hsl({},{}%,{}%)",
        color.0, color.1, color.2
    )));
    ctx.fill_rect((*x).floor(), (*y).floor(), 1.0, 1.0);
}

pub fn clear(ctx: &CanvasRenderingContext2d) {
    let Vec2(width, height) = CANVAS_SIZE;
    ctx.set_fill_style(&JsValue::from_str(BACKGROUND_COLOR));
    ctx.fill_rect(0.0, 0.0, width, height);
}
