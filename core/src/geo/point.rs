use serde::{Deserialize, Serialize};
use std::ops;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

impl Point {
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }

    pub fn dot(self, rhs: Self) -> f64 {
        self.x * rhs.x + self.y * rhs.y
    }

    pub fn len2(self) -> f64 {
        self.dot(self)
    }

    #[allow(clippy::len_without_is_empty)]
    pub fn len(self) -> f64 {
        self.len2().sqrt()
    }

    pub fn dist2(a: Self, b: Self) -> f64 {
        (a - b).len2()
    }

    pub fn dist(a: Self, b: Self) -> f64 {
        (a - b).len()
    }
}

impl ops::Add for Point {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        Self::new(self.x + rhs.x, self.y + rhs.y)
    }
}

impl ops::Sub for Point {
    type Output = Self;

    fn sub(self, rhs: Self) -> Self::Output {
        Self::new(self.x - rhs.x, self.y - rhs.y)
    }
}

impl ops::Mul<f64> for Point {
    type Output = Self;

    fn mul(self, rhs: f64) -> Self::Output {
        Self::new(self.x * rhs, self.y * rhs)
    }
}

impl ops::Mul<Point> for Point {
    type Output = f64;

    fn mul(self, rhs: Point) -> Self::Output {
        self.x * rhs.y - self.y * rhs.x
    }
}
