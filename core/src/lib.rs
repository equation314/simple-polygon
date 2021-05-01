pub mod geo;

use std::vec::Vec;

use geo::Point;

pub fn hello() -> usize {
    println!("Hello World!");
    2333
}

pub fn gen_polygon() -> Vec<geo::Point> {
    vec![
        Point::new(1.0, 1.0) * 100.0,
        Point::new(2.0, 1.0) * 100.0,
        Point::new(2.0, 2.0) * 100.0,
        Point::new(1.0, 2.0) * 100.0,
    ]
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
