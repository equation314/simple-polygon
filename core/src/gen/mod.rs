use rand::Rng;
use std::collections::HashSet;
use std::convert::TryFrom;

use crate::geo::{Point, Polygon};

mod backtracking;
mod permute;
mod space;
mod two_opt;

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum Algorithm {
    SteadyGrowth,
    SpacePartitioning,
    TwoOptMoves,
    PermuteReject,
}

pub enum SteppingResult {
    None,
    SpacePartitioning(space::SpacePartitionSteppingResult),
    TwoOptMoves(two_opt::TwoOptMovesSteppingResult),
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

pub struct RandomPolygonGenerator<'a, R: Rng> {
    rng: &'a mut R,
    is_stepping: bool,
    stepping_result: SteppingResult,
}

impl<'a, R: Rng> RandomPolygonGenerator<'a, R> {
    pub fn new(rng: &'a mut R) -> Self {
        Self {
            rng,
            is_stepping: false,
            stepping_result: SteppingResult::None,
        }
    }

    pub fn new_stepping(rng: &'a mut R) -> Self {
        Self {
            rng,
            is_stepping: true,
            stepping_result: SteppingResult::None,
        }
    }

    pub fn into_stepping_result(self) -> SteppingResult {
        self.stepping_result
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
        let mut indices = if self.is_stepping {
            match algo {
                Algorithm::PermuteReject => permute::generate(points, &mut self.rng),
                Algorithm::SpacePartitioning => {
                    let (idx, res) = space::generate_stepping(points, &mut self.rng);
                    self.stepping_result = SteppingResult::SpacePartitioning(res);
                    idx
                }
                Algorithm::TwoOptMoves => {
                    let (idx, res) = two_opt::generate_stepping(points, &mut self.rng);
                    self.stepping_result = SteppingResult::TwoOptMoves(res);
                    idx
                }
                _ => unreachable!(),
            }
        } else {
            match algo {
                Algorithm::PermuteReject => permute::generate(points, &mut self.rng),
                Algorithm::SpacePartitioning => space::generate(points, &mut self.rng),
                Algorithm::TwoOptMoves => two_opt::generate(points, &mut self.rng),
                _ => unreachable!(),
            }
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
            if !Point::collinear_many(&points) {
                return self.generate_from(&points, algo);
            }
        }
    }
}

pub fn gen_all_polygon_from(points: &[Point]) -> Vec<Vec<usize>> {
    assert!(points.len() >= 3);
    backtracking::generate_all(points)
}

pub fn gen_polygon_from(points: &[Point], algo: Algorithm) -> Polygon {
    let mut rng = rand::thread_rng();
    RandomPolygonGenerator::new(&mut rng).generate_from(points, algo)
}

pub fn gen_polygon(n: usize, range: usize, algo: Algorithm) -> Polygon {
    let mut rng = rand::thread_rng();
    RandomPolygonGenerator::new(&mut rng).generate(n, range, algo)
}
