use rand::Rng;
use std::convert::TryFrom;

use crate::geo::{Point, Polygon};

mod permute;

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

pub struct RandomPolygonGenerator {
    n: usize,
    range: usize,
    algo: Algorithm,
}

impl RandomPolygonGenerator {
    pub fn new(n: usize, range: usize, algo: Algorithm) -> Self {
        assert!(n >= 3);
        Self { n, range, algo }
    }

    pub fn random_points(n: usize, range: usize) -> Vec<Point> {
        let mut rng = rand::thread_rng();
        (0..n)
            .map(|_| {
                Point::new(
                    rng.gen_range(0, range) as f64,
                    rng.gen_range(0, range) as f64,
                )
            })
            .collect()
    }

    pub fn generate_indices_from(&self, points: &[Point]) -> Option<Vec<usize>> {
        match self.algo {
            _ => permute::generate(points),
        }
    }

    pub fn generate_from(&self, points: &[Point]) -> Option<Polygon> {
        self.generate_indices_from(points)
            .map(|indices| Polygon::new(indices.iter().map(|&i| points[i]).collect()))
    }

    pub fn generate(&self) -> Polygon {
        loop {
            if let Some(poly) = self.generate_from(&Self::random_points(self.n, self.range)) {
                return poly;
            }
        }
    }
}

pub fn gen_polygon(n: usize, range: usize, algo: Algorithm) -> Polygon {
    RandomPolygonGenerator::new(n, range, algo).generate()
}
