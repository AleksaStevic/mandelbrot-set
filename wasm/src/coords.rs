use crate::config::CANVAS_SIZE;
use crate::Vec2;
use wasm_bindgen::prelude::*;

static mut TRANSLATION_VECTOR: Vec2 = Vec2(0.11, -0.895);
static mut ZOOM: Vec2 = Vec2(1700.0, 1700.0);

pub fn to_pixel_space(coords: &Vec2) -> Vec2 {
    let Vec2(x, y) = coords;
    let (w, h) = CANVAS_SIZE;
    let Vec2(z1, z2) = get_zoom();
    let Vec2(t1, t2) = get_translation_vec();

    Vec2(
        (z1 * w * x + w * (z1 * t1 + 2.0)) / 4.0,
        (-z2 * h * y + h * (-z2 * t2 + 2.0)) / 4.0,
    )
}

pub fn to_vector_space(coords: &Vec2) -> Vec2 {
    let Vec2(x, y) = coords;
    let (w, h) = CANVAS_SIZE;
    let Vec2(z1, z2) = get_zoom();
    let Vec2(t1, t2) = get_translation_vec();

    Vec2(
        (4.0 * x - w * (t1 * z1 + 2.0)) / (z1 * w),
        (-4.0 * y - h * (t2 * z2 - 2.0)) / (z2 * h),
    )
}

pub fn set_translation_vec(v: Vec2) {
    unsafe {
        TRANSLATION_VECTOR = v;
    }
}

pub fn get_translation_vec() -> Vec2 {
    unsafe { TRANSLATION_VECTOR.clone() }
}

#[wasm_bindgen]
pub fn translate(x: f64, y: f64) {
    set_translation_vec(get_translation_vec() + (Vec2(x, y) / get_zoom()))
}

#[wasm_bindgen]
pub fn zoom(v: f64) {
    unsafe {
        ZOOM = ZOOM.clone() * v;
        ZOOM.0 = ZOOM.0.clamp(0.5, 1000.0);
        ZOOM.1 = ZOOM.1.clamp(0.5, 1000.0);
    }
}

fn get_zoom() -> Vec2 {
    unsafe { ZOOM.clone() }
}
