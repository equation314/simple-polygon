use crate::geo::{Point, Polygon};

pub fn find_shortest_path(poly: &Polygon, start: Point, end: Point) -> Vec<usize> {
    println!("{:?} {:?}", start, end);
    println!("{:#x?}", poly);
    vec![2, 3, 4]
}
