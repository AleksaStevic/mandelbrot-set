use wasm_bindgen::JsValue;
use web_sys::{CanvasRenderingContext2d, ImageData};

use crate::{render::draw_dot, to_vector_space, utils::lch_coloring, vector::Vec2};

const MAX_ITERATIONS: i32 = 1000;

// whether a side is in set or not (or we don't know and need to check), order: top, right, bottom, left
type SidesInSet = (Option<bool>, Option<bool>, Option<bool>, Option<bool>);

// check whether a rectangle [sx, sx+size]x[sy, sy+size] is in mandelbrot set
pub fn draw_rect(
    s: (i32, i32),
    size: (i32, i32),
    sides: SidesInSet,
    ctx: &CanvasRenderingContext2d,
    image_data: &mut ImageData,
) {
    let (sx, sy) = s;
    let (w, h) = size;

    if w <= 5 || h <= 5 {
        for x in (sx)..(sx + w) {
            for y in (sy)..(sy + h) {
                let pt = Vec2(f64::from(x), f64::from(y));
                let num_iters = calc_iterations(&to_vector_space(&pt), MAX_ITERATIONS);
                draw_dot(&pt, &lch_coloring(num_iters, MAX_ITERATIONS), &ctx);
            }
        }

        return;
    }

    let (mut top, mut right, mut bottom, mut left) = sides;

    if top == None {
        top = '_top: {
            for x in (sx)..(sx + w) {
                let pt = to_vector_space(&Vec2(f64::from(x), f64::from(sy)));
                if !(calc_iterations(&pt, MAX_ITERATIONS) == MAX_ITERATIONS) {
                    break '_top Some(false);
                }
            }
            Some(true)
        }
    }

    if right == None {
        right = '_right: {
            for y in (sy)..(sy + h) {
                let pt = to_vector_space(&Vec2(f64::from(sx + w), f64::from(y)));
                if !(calc_iterations(&pt, MAX_ITERATIONS) == MAX_ITERATIONS) {
                    break '_right Some(false);
                }
            }
            Some(true)
        }
    }

    if bottom == None {
        bottom = '_bottom: {
            for x in (sx)..(sx + w) {
                let pt = to_vector_space(&Vec2(f64::from(x), f64::from(sy + h)));
                if !(calc_iterations(&pt, MAX_ITERATIONS) == MAX_ITERATIONS) {
                    break '_bottom Some(false);
                }
            }
            Some(true)
        }
    }

    if left == None {
        left = '_left: {
            for y in (sy)..(sy + h) {
                let pt = to_vector_space(&Vec2(f64::from(sx), f64::from(y)));
                if !(calc_iterations(&pt, MAX_ITERATIONS) == MAX_ITERATIONS) {
                    break '_left Some(false);
                }
            }
            Some(true)
        }
    }

    if (top, right, left, bottom) == (Some(true), Some(true), Some(true), Some(true)) {
        let color = lch_coloring(MAX_ITERATIONS, MAX_ITERATIONS);
        ctx.set_fill_style(&JsValue::from_str(&color));
        ctx.fill_rect(f64::from(sx), f64::from(sy), f64::from(w), f64::from(h));
        return;
    }

    let (hw, hh) = (w / 2, h / 2);
    let (ow, oh) = (w - hw, h - hh);

    // top left
    draw_rect(
        (sx, sy),
        (hw, hh),
        (top, None, None, left),
        &ctx,
        image_data,
    );
    // top right
    draw_rect(
        (sx + hw, sy),
        (ow, hh),
        (top, right, None, None),
        &ctx,
        image_data,
    );
    // bottom left
    draw_rect(
        (sx, sy + hh),
        (hw, oh),
        (None, None, bottom, left),
        &ctx,
        image_data,
    );
    // bottom right
    draw_rect(
        (sx + hw, sy + hh),
        (ow, oh),
        (None, right, bottom, None),
        &ctx,
        image_data,
    );
}

// is converging: f_c(0), f_c(f_c(0)), ... , f_c(f_c( ... f_c(0) ... ))
pub fn calc_iterations(c: &Vec2, n: i32) -> i32 {
    let mut z = Vec2(0.0, 0.0);
    let mut old = Vec2(0.0, 0.0);
    let mut period = 0;
    for i in 0..n {
        // f_c(z) = z^2 + c
        z = z.sqr() + c;

        // detecting periods, if there is a period then the point is in mandelbrot set
        if z == old {
            return n;
        }

        if z.mag2() > 4.0 {
            return i + 1;
        }

        if period > 20 {
            period = 0;
            old = z.clone();
        }
    }

    n
}
