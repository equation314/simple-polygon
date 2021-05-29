use serde::{Deserialize, Serialize};
use std::ops;

const EPS: f64 = 1e-9;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[allow(clippy::len_without_is_empty)]
impl Point {
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }

    pub fn dot(&self, rhs: &Self) -> f64 {
        self.x * rhs.x + self.y * rhs.y
    }

    pub fn len2(&self) -> f64 {
        self.dot(self)
    }

    pub fn len(&self) -> f64 {
        self.len2().sqrt()
    }

    pub fn dist2(a: &Self, b: &Self) -> f64 {
        (*a - *b).len2()
    }

    pub fn dist(a: &Self, b: &Self) -> f64 {
        (*a - *b).len()
    }

    /// Does this point lie left to the line AB?
    ///
    /// Returns: 1: yes; -1: no; 0: on the line.
    pub fn to_left(&self, a: &Self, b: &Self) -> isize {
        let t = (*b - *a) * (*self - *a);
        if t > EPS {
            1
        } else if t < -EPS {
            -1
        } else {
            0
        }
    }

    /// Is this point in the triangle ABC?
    ///
    /// Returns: 1: yes; -1: no; 0: on one side of the triangle.
    pub fn in_triangle(&self, a: &Self, b: &Self, c: &Self) -> isize {
        let ab = self.to_left(a, b);
        let bc = self.to_left(b, c);
        let ca = self.to_left(c, a);
        if ab > 0 && bc > 0 && ca > 0 {
            1
        } else if ab < 0 || bc < 0 || ca < 0 {
            -1
        } else {
            0
        }
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
