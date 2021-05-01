use clap::{App, AppSettings, Arg, SubCommand};
use simple_polygon_core as sp;

fn main() {
    let matches = App::new("Simple polygon generator and find the shortest paths")
        .setting(AppSettings::ArgRequiredElseHelp)
        .subcommand(
            SubCommand::with_name("gen")
                .about("Generate a random polygon")
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
                    Arg::with_name("algorithm")
                        .value_name("ALGORITHM")
                        .long("algo")
                        .short("a")
                        .takes_value(true)
                        .possible_values(&["growth", "space", "2opt"])
                        .default_value("2opt")
                        .help("The algorithm of generator"),
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
            SubCommand::with_name("sp")
                .about("Find the shortest path inside a simple polygon")
                .display_order(2)
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
                ),
        )
        .get_matches();

    match matches.subcommand() {
        ("gen", Some(m)) => {
            let n: usize = m.value_of("n").unwrap().parse().unwrap();
            let algo = m.value_of("algorithm").unwrap();
            let output = m.value_of("output");
            println!("N: {}, algo: {}, output: {:?}", n, algo, output);
            println!("{:?}", sp::gen_polygon());
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
            println!("input: {}, start: {:?}, end: {:?}", input, start, end);
        }
        _ => unreachable!(),
    }
}
