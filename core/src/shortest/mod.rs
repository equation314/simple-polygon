use crate::geo::{Point, Polygon};
use crate::tri::{Algorithm, Triangulation};

pub fn find_shortest_path(poly: &Polygon, start: Point, end: Point) -> Vec<usize> {
    println!("{:?} {:?}", start, end);
    println!("{:#?}", poly);

    let tri = Triangulation::build(poly, Algorithm::EarCutting);
    let res = tri.result();

    println!("{:?}", res.diagonals);
    for t in &res.triangles {
        let e1 = t.borrow().first_edge.upgrade().unwrap();
        let e2 = e1.borrow().next.upgrade().unwrap();
        let e3 = e2.borrow().next.upgrade().unwrap();

        let a = e1.borrow().start;
        let b = e2.borrow().start;
        let c = e3.borrow().start;
        assert!(e3.borrow().end == a);
        println!("{} {} {}", a, b, c);
    }

    vec![2, 3, 4]
}
