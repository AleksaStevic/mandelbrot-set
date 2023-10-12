use crate::vector::Vec2;
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

pub const CANVAS_SIZE: Vec2 = Vec2(400.0, 400.0);

// const AXIS_LINE_COLOR: &str = "#EDFFEC";
pub const BACKGROUND_COLOR: &str = "#99B2DD";
pub const MANDELBROT_COLOR: &str = "#3A405A";

pub fn draw_dot(center: &Vec2, ctx: &CanvasRenderingContext2d) {
    let Vec2(x, y) = center;
    ctx.set_fill_style(&JsValue::from_str(MANDELBROT_COLOR));
    ctx.fill_rect((*x).floor(), (*y).floor(), 1.0, 1.0);
}

// pub fn draw_axis_lines(ctx: &CanvasRenderingContext2d) {
//     ctx.set_stroke_style(&JsValue::from_str(AXIS_LINE_COLOR));
//     ctx.set_line_width(1.0);
//     ctx.begin_path();
//     let top_left = to_vector_space(&Vec2(0.0, 0.0));
//     let bottom_right = to_vector_space(&Vec2(CANVAS_SIZE.0, CANVAS_SIZE.1));
//     let x_line_start = to_pixel_space(&Vec2(top_left.0, 0.0));
//     let x_line_end = to_pixel_space(&Vec2(bottom_right.0, 0.0));
//     ctx.move_to(x_line_start.0, x_line_start.1);
//     ctx.line_to(x_line_end.0, x_line_end.1);
//     ctx.stroke();
//     ctx.close_path();

//     ctx.begin_path();
//     let y_line_start = to_pixel_space(&vec(0.0, top_left.1));
//     let y_line_end = to_pixel_space(&vec(0.0, bottom_right.1));
//     ctx.move_to(y_line_start.0, y_line_start.0);
//     ctx.line_to(y_line_end.1, y_line_end.1);
//     ctx.stroke();
//     ctx.close_path();
// }

pub fn clear(ctx: &CanvasRenderingContext2d) {
    let Vec2(width, height) = CANVAS_SIZE;
    ctx.set_fill_style(&JsValue::from_str(BACKGROUND_COLOR));
    ctx.fill_rect(0.0, 0.0, width, height);
}
