use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{self, prelude::*, BufReader, BufWriter};

use super::point::Point;

#[derive(Debug, Serialize, Deserialize)]
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

    pub fn from_slice<T>(points: &[[T; 2]]) -> Self
    where
        T: Copy + Into<f64>,
    {
        let points = points
            .iter()
            .map(|p| Point::new(p[0].into(), p[1].into()))
            .collect();
        Self { points }
    }

    pub fn from_file(file_name: &str) -> io::Result<Self> {
        let file = File::open(file_name)?;
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

    pub fn save_to(&self, file_name: &str) -> io::Result<()> {
        let file = File::create(file_name)?;
        let mut writer = BufWriter::new(file);

        for p in &self.points {
            writeln!(writer, "{} {}", p.x, p.y)?;
        }
        Ok(())
    }
}
