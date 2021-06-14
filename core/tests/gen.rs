use rand::{prelude::*, Rng};

use simple_polygon_core as sp;
use sp::gen::{self, Algorithm, RandomPolygonGenerator};
use sp::geo::{Point, Polygon};

const TEST_TIMES: usize = 10;

fn get_random_n_and_range(max_n: usize, rng: &mut impl Rng) -> (usize, usize) {
    let n = rng.gen_range(3, max_n + 1);
    loop {
        let range = *[10, 100, 1_000, 10_000, 100_000, 1_000_000]
            .choose(rng)
            .unwrap();
        if range * range >= n {
            return (n, range);
        }
    }
}

fn grid_points(n: usize, m: usize) -> Vec<Point> {
    let mut points: Vec<Point> = Vec::new();
    for i in 0..n {
        for j in 0..m {
            points.push(Point::new(i as _, j as _));
        }
    }
    points
}

fn get_random_grid_points(max_n: usize, rng: &mut impl Rng) -> (usize, usize, Vec<Point>) {
    loop {
        let n = rng.gen_range(2, max_n / 2);
        let m = rng.gen_range(2, max_n / 2);
        if n * m <= max_n {
            return (n, m, grid_points(n, m));
        }
    }
}

fn test_gen_polygon(algo: Algorithm, max_n: usize) {
    let mut rng = rand::thread_rng();
    for _ in 0..TEST_TIMES {
        let (n, range) = get_random_n_and_range(max_n, &mut rng);
        println!(
            "{:?}: test simple poylgon generation for {} random points ...",
            algo, n
        );

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

fn test_gen_polygon_from_grid(algo: Algorithm, max_n: usize) {
    let mut rng = rand::thread_rng();
    for _ in 0..TEST_TIMES {
        let (n, m, points) = get_random_grid_points(max_n, &mut rng);
        println!(
            "{:?}: test simple poylgon generation for {}x{} grid ...",
            algo, n, m
        );

        let poly = gen::gen_polygon_from(&points, algo);
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
fn test_generate_all_grid() {
    assert_eq!(gen::gen_all_polygon_from(&grid_points(1, 20)).len(), 0);
    assert_eq!(gen::gen_all_polygon_from(&grid_points(2, 2)).len(), 1);
    assert_eq!(gen::gen_all_polygon_from(&grid_points(2, 3)).len(), 1);
    assert_eq!(gen::gen_all_polygon_from(&grid_points(8, 2)).len(), 1);
    assert_eq!(gen::gen_all_polygon_from(&grid_points(3, 3)).len(), 8);
    assert_eq!(gen::gen_all_polygon_from(&grid_points(3, 4)).len(), 62);
    assert_eq!(gen::gen_all_polygon_from(&grid_points(5, 3)).len(), 532);
    assert_eq!(gen::gen_all_polygon_from(&grid_points(4, 4)).len(), 1930);
    // assert_eq!(gen_all_polygon_from(&grid_points(3, 6)).len(), 4846);
}

#[test]
fn gen_polygon_2opt() {
    test_gen_polygon(Algorithm::TwoOptMoves, 3000);
    test_gen_polygon_from_grid(Algorithm::TwoOptMoves, 2000);
}

#[test]
fn gen_polygon_space() {
    test_gen_polygon(Algorithm::SpacePartitioning, 20000);
    test_gen_polygon_from_grid(Algorithm::SpacePartitioning, 20000);
}

#[test]
fn gen_polygon_permute() {
    test_gen_polygon(Algorithm::PermuteReject, 16);
}
