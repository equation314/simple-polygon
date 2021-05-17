use std::fs;
use std::rc::Rc;

use simple_polygon_core as sp;
use sp::geo::Polygon;
use sp::tri::{Algorithm, Triangulation, TriangulationResult};

fn validate_result(poly: &Polygon, result: &TriangulationResult) {
    let n = poly.size();
    assert_eq!(result.diagonals.len(), n - 3);
    assert_eq!(result.edges.len(), 4 * n - 6);
    assert_eq!(result.triangles.len(), n - 2);

    let mut visited = vec![false; result.edges.len()];
    for t in &result.triangles {
        let e1_rc = t.borrow().first_edge.upgrade().unwrap();
        let e1 = e1_rc.borrow();
        let e2_rc = e1.next.upgrade().unwrap();
        let e2 = e2_rc.borrow();
        let e3_rc = e2.next.upgrade().unwrap();
        let e3 = e3_rc.borrow();
        assert!(Rc::ptr_eq(&e3.next.upgrade().unwrap(), &e1_rc));
        assert!(Rc::ptr_eq(&e1.face.upgrade().unwrap(), t));
        assert!(Rc::ptr_eq(&e2.face.upgrade().unwrap(), t));
        assert!(Rc::ptr_eq(&e3.face.upgrade().unwrap(), t));
        assert!(!visited[e1.id]);
        assert!(!visited[e2.id]);
        assert!(!visited[e3.id]);
        visited[e1.id] = true;
        visited[e2.id] = true;
        visited[e3.id] = true;

        let a = e1.end;
        let b = e2.end;
        let c = e3.end;
        assert_eq!(a, e2.start);
        assert_eq!(b, e3.start);
        assert_eq!(c, e1.start);
        assert!(poly.points[a].to_left(poly.points[b], poly.points[c]) > 0);
    }

    for e in &result.edges {
        let e = e.borrow();
        if !visited[e.id] {
            assert_eq!(e.start, (e.end + 1) % n);
        }
    }
}

fn test_triangulation(algo: Algorithm) {
    let paths = fs::read_dir("../testcases/").unwrap();
    for path in paths {
        let test_path = path.unwrap().path();
        println!("Test polygon from {:?}", test_path);
        let poly = Polygon::from_file(test_path).unwrap();
        let tri = Triangulation::build(&poly, algo);
        validate_result(&poly, tri.result());
    }
}

#[test]
fn ear_cutting() {
    test_triangulation(Algorithm::EarCutting);
}
