use rand::Rng;
use std::cell::RefCell;
use std::collections::HashSet;
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

pub struct RandomPolygonGenerator<R: Rng> {
    n: usize,
    range: usize,
    algo: Algorithm,
    rng: RefCell<R>,
}

impl<R: Rng> RandomPolygonGenerator<R> {
    pub fn new(n: usize, range: usize, algo: Algorithm, rng: R) -> Self {
        assert!(n >= 3);
        Self {
            n,
            range,
            algo,
            rng: RefCell::new(rng),
        }
    }

    pub fn random_points(&self, n: usize, range: usize) -> Vec<Point> {
        let mut rng = self.rng.borrow_mut();
        let mut visited = HashSet::new();
        (0..n)
            .map(|_| loop {
                let p = (rng.gen::<usize>() % range, rng.gen::<usize>() % range);
                if !visited.contains(&p) {
                    visited.insert(p);
                    return Point::new(p.0 as _, p.1 as _);
                }
            })
            .collect()
    }

    pub fn uniform_indices(indices: &mut [usize], points: &[Point]) {
        if !Polygon::new(points.to_vec()).is_ccw() {
            indices.reverse();
        }
        indices.rotate_left(indices.iter().position(|&i| i == 0).unwrap());
        println!("{:?}", indices);
    }

    pub fn generate_indices_from(&mut self, points: &[Point]) -> Option<Vec<usize>> {
        use std::ops::DerefMut;
        match self.algo {
            _ => permute::generate(points, self.rng.borrow_mut().deref_mut()),
        }
        .map(|mut indices| {
            Self::uniform_indices(&mut indices, points);
            indices
        })
    }

    pub fn generate_from(&mut self, points: &[Point]) -> Option<Polygon> {
        self.generate_indices_from(points)
            .map(|ref indices| Polygon::from_indices(points, indices))
    }

    pub fn generate(&mut self) -> Polygon {
        loop {
            let points = self.random_points(self.n, self.range);
            println!("{:?}", points);
            if let Some(poly) = self.generate_from(&points) {
                return poly;
            }
        }
    }
}

pub fn gen_polygon(n: usize, range: usize, algo: Algorithm) -> Polygon {
    let rng = rand::thread_rng();
    RandomPolygonGenerator::new(n, range, algo, rng).generate()
}
