use std::fs::File;
use std::io::{self, prelude::*, BufReader, BufWriter};
use std::path::Path;

use super::point::Point;

#[derive(Debug)]
pub struct Polygon {
    pub points: Vec<Point>,
}

impl Polygon {
    pub fn size(&self) -> usize {
        self.points.len()
    }

    pub fn new(points: Vec<Point>) -> Self {
        Self { points }
    }

    /// The area of the polygon.
    pub fn area(&self) -> f64 {
        let n = self.size();
        let mut area = 0.0;
        for i in 0..n {
            area += self.points[i] * self.points[(i + 1) % n];
        }
        area / 2.0
    }

    /// Whether the polygon vertices are in counterclockwise order.
    pub fn is_ccw(&self) -> bool {
        self.area() > Point::EPS
    }

    /// Whether the polygon is a simple polygon.
    #[allow(clippy::many_single_char_names)]
    pub fn is_simple(&self) -> bool {
        let n = self.size();
        for i in 0..n {
            let a = &self.points[i];
            let b = &self.points[(i + 1) % n];
            for j in i + 1..n {
                let c = &self.points[j];
                let d = &self.points[(j + 1) % n];
                if a == c {
                    return false;
                }
                if Point::segment_intersection(a, b, c, d) {
                    return false;
                }
            }
        }
        true
    }

    pub fn from_slice<T>(points: &[[T; 2]]) -> Self
    where
        T: Copy + Into<f64>,
    {
        let points = points.iter().map(|&p| p.into()).collect();
        Self::new(points)
    }

    pub fn from_file<P: AsRef<Path>>(path: P) -> io::Result<Self> {
        let file = File::open(path)?;
        let reader = BufReader::new(file);

        let mut points = Vec::new();
        for line in reader.lines() {
            let line = line?;
            let vals = line.split_whitespace().collect::<Vec<_>>();
            if vals.is_empty() {
                continue;
            }
            if vals.len() != 2 {
                return Err(io::Error::new(
                    io::ErrorKind::InvalidData,
                    "invalid input data",
                ));
            }
            points.push(Point::new(
                vals[0].parse().unwrap(),
                vals[1].parse().unwrap(),
            ));
        }
        Ok(Self::new(points))
    }

    pub fn save_to_file<P: AsRef<Path>>(&self, path: P) -> io::Result<()> {
        let file = File::create(path)?;
        let mut writer = BufWriter::new(file);

        for p in &self.points {
            writeln!(writer, "{} {}", p.x, p.y)?;
        }
        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::Polygon;

    #[test]
    fn test_ccw() {
        let mut poly = Polygon::from_slice(&[
            [104, 129],
            [76, 118],
            [90, 100],
            [95, 110],
            [92, 99],
            [100, 100],
            [101, 108],
            [107, 90],
            [109, 109],
            [128, 113],
        ]);
        assert!(poly.is_ccw());
        poly.points.reverse();
        assert!(!poly.is_ccw());
    }

    #[test]
    fn test_simple() {
        let poly0 = Polygon::from_slice(&[[0, 0], [0, 1], [1, 0]]);
        assert!(!poly0.is_ccw());
        assert!(poly0.is_simple());

        let poly1 = Polygon::from_slice(&[[0, 0], [0, 1]]);
        assert!(!poly1.is_simple());

        let poly2 = Polygon::from_slice(&[[0, 0], [1, 1], [2, 2]]);
        assert!(!poly2.is_simple());

        let poly3 = Polygon::from_slice(&[[0, 0], [1, 1], [2, 2], [2, 3]]);
        assert!(poly3.is_simple());

        let poly4 = Polygon::from_slice(&[[0, 0], [1, 0], [0, 1], [0, 0]]);
        assert!(!poly4.is_simple());

        let poly5 = Polygon::from_slice(&[[0, 0], [1, 0], [0, 1], [1, 2], [0, 2]]);
        assert!(!poly5.is_simple());

        let poly6 = Polygon::from_slice(&[[0, 0], [1, 0], [0, 1], [1, 2], [0, 2], [0, 1]]);
        assert!(!poly6.is_simple());

        let poly7 = Polygon::from_slice(&[
            [0.0, 0.0],
            [1.0, 0.0],
            [1e-9, 1.0],
            [1.0, 2.0],
            [0.0, 2.0],
            [0.0, 1.0],
        ]);
        assert!(poly7.is_simple());

        let poly8 = Polygon::from_slice(&[[0, 0], [1, 0], [0, 1], [1, 1]]);
        assert!(!poly8.is_simple());

        let poly9 = Polygon::from_slice(&[[0, 0], [2, 0], [1, 0], [1, 1], [0, 1]]);
        assert!(!poly9.is_simple());

        let poly10 = Polygon::from_slice(&[[0, 0], [1, 0], [2, 0], [1, 0], [1, 1], [0, 1]]);
        assert!(!poly10.is_simple());

        let poly11 = Polygon::from_slice(&[[0, 0], [2, 0], [1, 0], [3, 0], [0, 1]]);
        assert!(!poly11.is_simple());

        let poly12 = Polygon::from_slice(&[
            [104, 129],
            [76, 118],
            [90, 100],
            [95, 110],
            [92, 99],
            [100, 100],
            [101, 108],
            [107, 90],
            [109, 109],
            [128, 113],
        ]);
        assert!(poly12.is_simple());
    }
}
