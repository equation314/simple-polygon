use rand::{prelude::SliceRandom, Rng};

use crate::geo::{Point, Polygon};

pub fn generate(points: &[Point], rng: &mut impl Rng) -> Vec<usize> {
    let mut indices = (0..points.len()).collect::<Vec<_>>();
    let mut poly = Polygon::from_slice(points);
    let mut times = 0;
    loop {
        times += 1;
        indices.shuffle(rng);
        for (i, &j) in indices.iter().enumerate() {
            poly.points[i] = points[j];
        }
        if poly.is_simple() {
            println!(
                "Permute & Reject: got a simple polygon after the {}-th attempt for {} points!",
                times,
                points.len(),
            );
            return indices;
        }
    }
}
