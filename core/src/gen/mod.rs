use rand::Rng;
use std::collections::HashSet;
use std::convert::TryFrom;

use crate::geo::{Point, Polygon};

mod backtracking;
mod permute;
mod two_opt;

#[derive(Debug, Clone, Copy)]
pub enum Algorithm {
    SteadyGrowth,
    SpacePartitioning,
    TwoOptMoves,
    PermuteReject,
}

impl<'a> TryFrom<&'a str> for Algorithm {
    type Error = &'a str;
    fn try_from(algo_str: &'a str) -> Result<Self, Self::Error> {
        match algo_str {
            "growth" => Ok(Algorithm::SteadyGrowth),
            "space" => Ok(Algorithm::SpacePartitioning),
            "2opt" => Ok(Algorithm::TwoOptMoves),
            "permute" => Ok(Algorithm::PermuteReject),
            _ => Err(algo_str),
        }
    }
}

pub struct RandomPolygonGenerator<R: Rng> {
    rng: R,
}

impl<R: Rng> RandomPolygonGenerator<R> {
    pub fn new(rng: R) -> Self {
        Self { rng }
    }

    pub fn random_points(&mut self, n: usize, range: usize) -> Vec<Point> {
        let mut visited = HashSet::new();
        (0..n)
            .map(|_| loop {
                let p = (self.rng.gen_range(0, range), self.rng.gen_range(0, range));
                if !visited.contains(&p) {
                    visited.insert(p);
                    return Point::new(p.0 as _, p.1 as _);
                }
            })
            .collect()
    }

    pub fn uniform_indices(indices: &mut [usize], points: &[Point]) {
        if !Polygon::from_indices(points, indices).is_ccw() {
            indices.reverse();
        }
        indices.rotate_left(indices.iter().position(|&i| i == 0).unwrap());
    }

    pub fn generate_indices_from(&mut self, points: &[Point], algo: Algorithm) -> Vec<usize> {
        assert!(points.len() >= 3);
        let mut indices = match algo {
            Algorithm::PermuteReject => permute::generate(points, &mut self.rng),
            _ => two_opt::generate(points, &mut self.rng),
        };
        Self::uniform_indices(&mut indices, points);
        indices
    }

    pub fn generate_from(&mut self, points: &[Point], algo: Algorithm) -> Polygon {
        let indices = self.generate_indices_from(points, algo);
        Polygon::from_indices(points, &indices)
    }

    pub fn generate(&mut self, n: usize, range: usize, algo: Algorithm) -> Polygon {
        loop {
            let points = self.random_points(n, range);
            if !Point::collinear(&points) {
                return self.generate_from(&points, algo);
            }
        }
    }
}

pub fn gen_all_polygon_from(points: &[Point]) -> Vec<Vec<usize>> {
    assert!(points.len() >= 2);
    backtracking::generate_all(points)
}

pub fn gen_polygon(n: usize, range: usize, algo: Algorithm) -> Polygon {
    let rng = rand::thread_rng();
    RandomPolygonGenerator::new(rng).generate(n, range, algo)
}

#[cfg(test)]
mod test {
    use super::*;

    fn grid_points(n: usize, m: usize) -> Vec<Point> {
        let mut points: Vec<Point> = Vec::new();
        for i in 0..n {
            for j in 0..m {
                points.push(Point::new(i as _, j as _));
            }
        }
        points
    }

    #[test]
    fn test_generate_all() {
        assert_eq!(gen_all_polygon_from(&grid_points(1, 20)).len(), 0);
        assert_eq!(gen_all_polygon_from(&grid_points(2, 2)).len(), 1);
        assert_eq!(gen_all_polygon_from(&grid_points(2, 3)).len(), 1);
        assert_eq!(gen_all_polygon_from(&grid_points(8, 2)).len(), 1);
        assert_eq!(gen_all_polygon_from(&grid_points(3, 3)).len(), 8);
        assert_eq!(gen_all_polygon_from(&grid_points(3, 4)).len(), 62);
        assert_eq!(gen_all_polygon_from(&grid_points(5, 3)).len(), 532);
        assert_eq!(gen_all_polygon_from(&grid_points(4, 4)).len(), 1930);
        // assert_eq!(gen_all_polygon_from(&grid_points(3, 6)).len(), 4846);
    }
}
