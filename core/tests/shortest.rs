use std::fs::{self, File};
use std::io::{prelude::*, BufReader};

use simple_polygon_core as sp;
use sp::geo::Polygon;

fn validate_result(res_file: &str, result: Option<&Vec<usize>>) {
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
    let test_num = fs::read_dir("../testcases/polygon").unwrap().count();
    for i in 0..test_num {
        let poly_path = format!("../testcases/polygon/{:02}.pts", i);
        let start_end_path = format!("../testcases/start_end/{:02}.pts", i);
        let res_path = format!("../testcases/shortest/{:02}.res", i);
        println!("Test shortest path from {:?}", poly_path);

        let poly = Polygon::from_file(poly_path).unwrap();
        let start_end = Polygon::from_file(start_end_path).unwrap();
        let res = sp::shortest::find_shortest_path(&poly, start_end.points[0], start_end.points[1]);

        validate_result(&res_path, res.as_ref());
    }
}
