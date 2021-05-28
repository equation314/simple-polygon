use std::fs::{self, File};
use std::io::{prelude::*, BufReader};
use std::path::Path;

use simple_polygon_core as sp;
use sp::geo::Polygon;

const TEST_DIR: &str = "../testcases";

fn validate_result(res_file: &Path, result: Option<&Vec<usize>>) {
    let file = File::open(res_file).unwrap();
    let reader = BufReader::new(file);
    let lines = reader.lines();
    if let Some(result) = result {
        for (i, line) in lines.enumerate() {
            let line = line.unwrap();
            if line == "s" {
                assert_eq!(i, 0);
                continue;
            }
            if line == "e" {
                break;
            }
            let node: usize = line.parse().unwrap();
            assert_eq!(node, result[i - 1]);
        }
    } else {
        assert_eq!(lines.count(), 0);
    }
}

#[test]
fn shortest_path() {
    let test_path = Path::new(TEST_DIR);
    let test_num = fs::read_dir(test_path.join("polygon")).unwrap().count();
    println!("found {} testcases in {:?}:", test_num, TEST_DIR);
    for i in 0..test_num {
        let poly_file = test_path.join(format!("polygon/{:02}.pts", i));
        let start_end_file = test_path.join(format!("start_end/{:02}.pts", i));
        let res_file = test_path.join(format!("shortest/{:02}.res", i));
        println!("test shortest path from {:?}", poly_file);

        let poly = Polygon::from_file(poly_file).unwrap();
        let start_end = Polygon::from_file(start_end_file).unwrap();
        let res = sp::shortest::find_shortest_path(&poly, start_end.points[0], start_end.points[1]);

        validate_result(&res_file, res.as_ref());
    }
}
