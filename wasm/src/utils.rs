extern crate web_sys;

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! console_log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

use std::f64::consts::PI;

pub(crate) use console_log;

pub fn lch_coloring(n: i32, max: i32) -> (f64, f64, f64) {
    let (nf, maxf) = (f64::from(n), f64::from(max));
    let s = nf / maxf;
    let v = 1.0 - (1.5 * PI * s + PI).cos().powf(2.0);
    (
        75.0 - (75.0 * v),
        28.0 + (75.0 - (75.0 * v)),
        (360.0 * s).powf(1.5) % 360.0,
    )
}

pub fn hsl_coloring(n: i32, max: i32) -> (f64, f64, f64) {
    let (nf, maxf) = (f64::from(n), f64::from(max));

    (
        (nf / maxf * 360.0).powf(1.5) % 360.0,
        50.0,
        nf / maxf * 100.0,
    )

    // hsl = [powf((i / max) * 360, 1.5) % 360, 50, (i / max) * 100]
}
