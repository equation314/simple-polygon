use rand::{prelude::SliceRandom, Rng};

use crate::geo::{Point, Polygon};

const MAX_TRY_TIMES: usize = 5000000;

pub fn generate(points: &[Point], rng: &mut impl Rng) -> Option<Vec<usize>> {
    let mut indices = (0..points.len()).collect::<Vec<_>>();
    let mut poly = Polygon::from_slice(points);
    for t in 0..MAX_TRY_TIMES {
        indices.shuffle(rng);
        for (i, &j) in indices.iter().enumerate() {
            poly.points[i] = points[j];
        }
        if poly.is_simple() {
            println!("Got a simple polygon after the {}-th attempt!", t + 1);
            return Some(indices);
        }
    }
    println!("To many attempts, re-generate points!");
    None
}
