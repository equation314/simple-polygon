use std::ops;

#[derive(Debug, Clone, Copy)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[allow(clippy::len_without_is_empty)]
impl Point {
    pub const EPS: f64 = 1e-9;

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
        if t > Self::EPS {
            1
        } else if t < -Self::EPS {
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

    /// Do the two segments AB and CD intersect? (not at the end point)
    pub fn segment_intersection(a: &Self, b: &Self, c: &Self, d: &Self) -> bool {
        let ac = *c - *a;
        let ab = *b - *a;
        let ad = *d - *a;
        let abc = ac * ab;
        let abd = ab * ad;
        if abc * abd < -Self::EPS {
            return false;
        }
        let ca = -ac;
        let cb = *b - *c;
        let cd = *d - *c;
        let acd = ca * cd;
        let bcd = cd * cb;
        if acd * bcd < -Self::EPS {
            return false;
        }

        if abc.abs() > Self::EPS
            && abd.abs() > Self::EPS
            && acd.abs() > Self::EPS
            && bcd.abs() > Self::EPS
        {
            return true;
        }
        abc.abs() < Self::EPS && ca.dot(&cb) < -Self::EPS || // AB contains C
        acd.abs() < Self::EPS && ac.dot(&ad) < -Self::EPS || // CD contains A
        abd.abs() < Self::EPS && ad.dot(&(*b - *d)) > Self::EPS || // AB contains D
        bcd.abs() < Self::EPS && cb.dot(&(*d - *b)) > Self::EPS // CD contains B
    }
}

impl PartialEq for Point {
    fn eq(&self, other: &Self) -> bool {
        (self.x - other.x).abs() < Point::EPS && (self.y - other.y).abs() < Point::EPS
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

impl ops::Neg for Point {
    type Output = Point;

    fn neg(self) -> Self::Output {
        Self::new(-self.x, -self.y)
    }
}

impl<T> From<[T; 2]> for Point
where
    T: Copy + Into<f64>,
{
    fn from(p: [T; 2]) -> Self {
        Self::new(p[0].into(), p[1].into())
    }
}

#[cfg(test)]
mod test {
    use super::Point;

    #[test]
    fn test_segment_intersection() {
        assert!(Point::segment_intersection(
            &[-1, 0].into(),
            &[1, 0].into(),
            &[0, 1].into(),
            &[0, -1].into(),
        ));
        assert!(Point::segment_intersection(
            &[-1, 0].into(),
            &[1, 0].into(),
            &[0, 0].into(),
            &[0, 1].into(),
        ));
        assert!(Point::segment_intersection(
            &[-1, 0].into(),
            &[1, 0].into(),
            &[0, 0].into(),
            &[2, 0].into(),
        ));
        assert!(Point::segment_intersection(
            &[0, 0].into(),
            &[-1, 0].into(),
            &[-1, 0].into(),
            &[1, 0].into(),
        ));
        assert!(!Point::segment_intersection(
            &[1, 0].into(),
            &[-1, 0].into(),
            &[-1, 0].into(),
            &[1, 0].into(),
        ));
        assert!(!Point::segment_intersection(
            &[-1, 0].into(),
            &[1, 0].into(),
            &[0, 1].into(),
            &[1, 0].into(),
        ));
        assert!(!Point::segment_intersection(
            &[-1, 0].into(),
            &[1, 0].into(),
            &[2, 0].into(),
            &[1.0 - 1e-10, 0.0].into(),
        ));
        assert!(!Point::segment_intersection(
            &[-1, 0].into(),
            &[1, 0].into(),
            &[2, 0].into(),
            &[1.5, 0.0].into(),
        ));
    }
}
