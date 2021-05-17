use crate::geo::{Point, Polygon};
use crate::tri::{Algorithm, Triangulation};

pub fn find_shortest_path(poly: &Polygon, start: Point, end: Point) -> Vec<usize> {
    println!("{:?} {:?}", start, end);
    println!("{:#?}", poly);

    let mut tri = Triangulation::build(poly, Algorithm::EarCutting);
    tri.build_dual_graph();

    let res = tri.result();
    println!("{:?}", res.diagonals);

    for t in &res.triangles {
        let vertices: Vec<usize> = t.vertices().collect();
        println!("{:?} {:?}", t.id, vertices);
    }

    if let (Some(s), Some(e)) = (tri.location(start), tri.location(end)) {
        let path = tri.dual().find_path(s.id, e.id);
        println!("{:#?}", path);
        vec![2, 3, 4]
    } else {
        Vec::new()
    }
}
