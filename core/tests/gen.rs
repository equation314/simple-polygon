use rand::{prelude::*, Rng};

use simple_polygon_core as sp;
use sp::gen::{self, Algorithm, RandomPolygonGenerator};
use sp::geo::Polygon;

const TEST_TIMES: usize = 10;

fn get_random_n_and_range(max_n: usize, rng: &mut impl Rng) -> (usize, usize) {
    let n = rng.gen_range(3, max_n + 1);
    let range = *[10, 100, 1_000, 10_000, 100_000, 1_000_000]
        .choose(rng)
        .unwrap();
    (n, range)
}

fn test_gen_polygon(algo: Algorithm) {
    let mut rng = rand::thread_rng();
    for _ in 0..TEST_TIMES {
        let (n, range) = get_random_n_and_range(16, &mut rng);
        let poly = gen::gen_polygon(n, range, algo);
        assert!(poly.is_ccw());
        let is_simple = poly.is_simple();
        if !is_simple {
            println!("Not a simple polygon!");
            for p in poly.points {
                println!("{} {}", p.x, p.y);
            }
            assert!(is_simple);
        }
    }
}

#[test]
fn gen_all_polygon() {
    let mut rng = rand::thread_rng();
    for _ in 0..TEST_TIMES {
        let (n, range) = get_random_n_and_range(14, &mut rng);
        let points = RandomPolygonGenerator::new(rng).random_points(n, range);
        for indices in gen::gen_all_polygon_from(&points) {
            let poly = Polygon::from_indices(&points, &indices);
            assert!(poly.is_ccw());
            let is_simple = poly.is_simple();
            if !is_simple {
                println!("Not a simple polygon!");
                for p in poly.points {
                    println!("{} {}", p.x, p.y);
                }
                assert!(is_simple);
            }
        }
    }
}

#[test]
fn gen_polygon_permute() {
    test_gen_polygon(Algorithm::PermuteReject);
}