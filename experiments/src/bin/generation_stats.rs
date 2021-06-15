use rand::{rngs::StdRng, SeedableRng};
use std::collections::HashMap;
use std::fs::File;
use std::io::{self, prelude::*, BufWriter};

use simple_polygon_core as sp;
use sp::gen::{gen_all_polygon_from, Algorithm, RandomPolygonGenerator};
use sp::geo::Polygon;

const SUITS: [(usize, usize); 3] = [(10, 10_000), (10, 100_000), (15, 1_000_000)];

const SAMPLES: usize = 10;
const RANGE: usize = 1000;

const ALGOS: [Algorithm; 3] = [
    Algorithm::TwoOptMoves,
    Algorithm::SpacePartitioning,
    Algorithm::PermuteReject,
];

type Stats = HashMap<Vec<usize>, usize>;

fn write_result(
    maxn: usize,
    gen_times: usize,
    sample_id: usize,
    algo: Algorithm,
    stats: &Stats,
) -> io::Result<()> {
    let fname = format!("{}_{}_{}_{:?}.csv", maxn, gen_times, sample_id, algo);
    let file = File::create(fname)?;
    let mut writer = BufWriter::new(file);

    let mut sorted_stats = stats.iter().collect::<Vec<_>>();
    sorted_stats.sort();
    for (poly, count) in &sorted_stats {
        writeln!(writer, "\"{:?}\",{}", poly, count)?;
    }
    Ok(())
}

fn stats_one_suit(maxn: usize, gen_times: usize) {
    println!("===== maxn = {}, gen_times = {} =====", maxn, gen_times);

    let mut rng0 = &mut StdRng::seed_from_u64(0xdeadbeef);
    let mut points_gen = RandomPolygonGenerator::new(&mut rng0);

    for s in 0..SAMPLES {
        let points = points_gen.random_points(maxn, RANGE);
        Polygon::new(points.clone())
            .save_to_file(format!("{}_{}_{}_poly.pts", maxn, gen_times, s))
            .unwrap();

        println!("Dataset {}:", s);
        let all_polys = gen_all_polygon_from(&points);
        println!("Got all {} polygons!", all_polys.len());

        for &algo in ALGOS.iter() {
            if algo == Algorithm::PermuteReject && maxn > 10 {
                continue;
            }

            let mut stats = HashMap::new();
            for poly in all_polys.iter() {
                stats.insert(poly.clone(), 0);
            }

            println!("Generate {} polygons using {:?} ...", gen_times, algo);
            let mut rng1 = &mut StdRng::seed_from_u64(0xcafebabe);
            let mut rpg = RandomPolygonGenerator::new(&mut rng1);
            for _ in 0..gen_times {
                let idx = rpg.generate_indices_from(&points, algo);
                *stats.get_mut(&idx).unwrap() += 1;
            }

            write_result(maxn, gen_times, s, algo, &stats).unwrap();
        }
        println!();
    }
}

fn main() {
    for &(maxn, gen_times) in &SUITS {
        stats_one_suit(maxn, gen_times);
    }
}
