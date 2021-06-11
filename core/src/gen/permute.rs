use crate::geo::Point;

pub fn generate(points: &[Point]) -> Option<Vec<usize>> {
    Some((0..points.len()).rev().collect())
}
