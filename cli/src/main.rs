use clap::{App, AppSettings, Arg, SubCommand};
use simple_polygon_core as sp;
use sp::geo::{Point, Polygon};
use std::convert::TryInto;

mod logging;

fn main() {
    logging::init();
    let matches = App::new("Simple polygon generator and find the shortest paths")
        .setting(AppSettings::ArgRequiredElseHelp)
        .subcommand(
            SubCommand::with_name("gen")
                .about("Generate a random simple polygon")
                .display_order(1)
                .arg(
                    Arg::with_name("n")
                        .value_name("N")
                        .short("n")
                        .takes_value(true)
                        .required(true)
                        .display_order(1)
                        .help("Number of vertices"),
                )
                .arg(
                    Arg::with_name("range")
                        .value_name("R")
                        .long("range")
                        .short("r")
                        .takes_value(true)
                        .default_value("1000")
                        .help("The coordinate range [0, R) of the generated polygon"),
                )
                .arg(
                    Arg::with_name("algorithm")
                        .value_name("ALGORITHM")
                        .long("algo")
                        .short("a")
                        .takes_value(true)
                        .possible_values(&["growth", "space", "2opt", "permute"])
                        .default_value("2opt")
                        .help("The algorithm of the generator"),
                )
                .arg(
                    Arg::with_name("output")
                        .value_name("FILE")
                        .long("output")
                        .short("o")
                        .takes_value(true)
                        .help("The output polygon file"),
                ),
        )
        .subcommand(
            SubCommand::with_name("tri")
                .about("Triangulate a simple polygon")
                .display_order(2)
                .arg(
                    Arg::with_name("input")
                        .value_name("IN_FILE")
                        .takes_value(true)
                        .required(true)
                        .help("The input polygon file"),
                )
                .arg(
                    Arg::with_name("algorithm")
                        .value_name("ALGORITHM")
                        .long("algo")
                        .short("a")
                        .takes_value(true)
                        .possible_values(&["ear_cutting", "mono_partition"])
                        .default_value("mono_partition")
                        .help("The triangulation algorithm"),
                )
                .arg(
                    Arg::with_name("output")
                        .value_name("OUT_FILE")
                        .long("output")
                        .short("o")
                        .takes_value(true)
                        .help("Output diagonals to the file"),
                ),
        )
        .subcommand(
            SubCommand::with_name("sp")
                .about("Find the shortest path inside a simple polygon")
                .display_order(3)
                .arg(
                    Arg::with_name("input")
                        .value_name("FILE")
                        .takes_value(true)
                        .required(true)
                        .help("The input polygon file"),
                )
                .arg(
                    Arg::with_name("start")
                        .value_names(&["x", "y"])
                        .long("start")
                        .short("s")
                        .takes_value(true)
                        .required(true)
                        .allow_hyphen_values(true)
                        .number_of_values(2)
                        .display_order(1)
                        .help("The start point"),
                )
                .arg(
                    Arg::with_name("end")
                        .value_names(&["x", "y"])
                        .long("end")
                        .short("e")
                        .takes_value(true)
                        .required(true)
                        .allow_hyphen_values(true)
                        .number_of_values(2)
                        .display_order(2)
                        .help("The end point"),
                )
                .arg(
                    Arg::with_name("algorithm")
                        .value_name("ALGORITHM")
                        .long("algo")
                        .short("a")
                        .takes_value(true)
                        .possible_values(&["ear_cutting", "mono_partition"])
                        .default_value("mono_partition")
                        .help("The triangulation algorithm"),
                ),
        )
        .get_matches();

    match matches.subcommand() {
        ("gen", Some(m)) => {
            let n: usize = m.value_of("n").unwrap().parse().unwrap();
            let range: usize = m.value_of("range").unwrap().parse().unwrap();
            let algo = m.value_of("algorithm").unwrap();
            let output = m.value_of("output");
            let poly = sp::gen::gen_polygon(n, range, algo.try_into().unwrap());
            if let Some(fname) = output {
                poly.save_to_file(fname).unwrap();
            } else {
                for p in poly.points {
                    println!("{} {}", p.x, p.y);
                }
            }
        }
        ("tri", Some(m)) => {
            let input = m.value_of("input").unwrap();
            let algo = m.value_of("algorithm").unwrap();
            let output = m.value_of("output");
            let mut poly = Polygon::from_file(input).unwrap();
            poly.force_ccw();
            let tri = sp::tri::Triangulation::build(&poly, algo.try_into().unwrap());
            let diagonals = &tri.result().diagonals;
            if let Some(fname) = output {
                use std::fs::File;
                use std::io::{prelude::*, BufWriter};
                let file = File::create(fname).unwrap();
                let mut writer = BufWriter::new(file);
                for (u, v) in diagonals {
                    writeln!(writer, "{} {}", u, v).unwrap();
                }
            } else {
                for (u, v) in diagonals {
                    println!("{} {}", u, v);
                }
            }
        }
        ("sp", Some(m)) => {
            let input = m.value_of("input").unwrap();
            let start: Vec<f64> = m
                .values_of("start")
                .unwrap()
                .map(|val| val.parse().unwrap())
                .collect();
            let end: Vec<f64> = m
                .values_of("end")
                .unwrap()
                .map(|val| val.parse().unwrap())
                .collect();
            let algo = m.value_of("algorithm").unwrap();
            let mut poly = Polygon::from_file(input).unwrap();
            poly.force_ccw();
            let path = sp::shortest::find_shortest_path(
                &poly,
                Point::new(start[0], start[1]),
                Point::new(end[0], end[1]),
                algo.try_into().unwrap(),
            );
            println!("{:?}", path);
        }
        _ => unreachable!(),
    }
}
