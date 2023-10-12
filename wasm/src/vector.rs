use impl_ops::impl_op_ex;
use std::ops;

#[derive(Clone, PartialEq)]
pub struct Vec2(pub f64, pub f64);

impl Vec2 {
    // Return squared magnitude of the vector
    #[inline]
    pub fn mag2(&self) -> f64 {
        self.0 * self.0 + self.1 * self.1
    }

    // Multiply vectors coordinate by coordinate
    #[inline]
    pub fn cmul(&self, other: &Vec2) -> Vec2 {
        Vec2(
            self.0 * other.0 - self.1 * other.1,
            self.0 * other.1 + self.1 * other.0,
        )
    }

    // Square a vector treating it as a complex number
    #[inline]
    pub fn sqr(&self) -> Vec2 {
        Vec2(self.0 * self.0 - self.1 * self.1, 2.0 * self.0 * self.1)
    }

    #[inline]
    pub fn invert(&self) -> Vec2 {
        Vec2(1.0 / self.0, 1.0 / self.1)
    }
}

impl_op_ex!(+ |a: &Vec2, b: &Vec2| -> Vec2 { Vec2(a.0 + b.0, a.1 + b.1) });
impl_op_ex!(+ |a: &Vec2, b: f64| -> Vec2 { Vec2(a.0 + b, a.1 + b) });
impl_op_ex!(-|a: &Vec2, b: &Vec2| -> Vec2 { Vec2(a.0 - b.0, a.1 - b.1) });
impl_op_ex!(*|a: &Vec2, b: &Vec2| -> Vec2 { Vec2(a.0 * b.0, a.1 * b.1) });
impl_op_ex!(*|a: &Vec2, b: f64| -> Vec2 { Vec2(a.0 * b, a.1 * b) });
impl_op_ex!(-|a: &Vec2| -> Vec2 { Vec2(-a.0, -a.1) });
impl_op_ex!(/ |a: &Vec2, b: f64| -> Vec2 { Vec2(a.0 / b, a.1 / b) });
impl_op_ex!(/ |a: &Vec2, b: &Vec2| -> Vec2 { Vec2(a.0 / b.0, a.1 / b.1) });
