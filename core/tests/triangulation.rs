use std::fs;
use std::path::Path;
use std::rc::Rc;

use simple_polygon_core as sp;
use sp::geo::{dcel::Edge, Polygon};
use sp::tri::{Algorithm, Triangulation, TriangulationResult};

const TEST_DIR: &str = "../testcases";

fn validate_result(poly: &Polygon, result: &TriangulationResult) {
    let n = poly.size();
    assert_eq!(result.diagonals.len(), n - 3);
    assert_eq!(result.plane_graph.edges.len(), 4 * n - 6);
    assert_eq!(result.plane_graph.faces.len(), n - 2);
    assert_eq!(result.plane_graph.raw_faces().count(), n - 2);

    let mut visited = vec![false; result.plane_graph.edges.len()];
    for t in &result.plane_graph.faces {
        let edges = t.edges().collect::<Vec<_>>();
        let vertices = t.vertices().collect::<Vec<_>>();
        assert_eq!(edges.len(), 3);
        assert_eq!(vertices.len(), 3);

        for e in &edges {
            let e = e.borrow();
            assert!(Rc::ptr_eq(e.face.as_ref().unwrap(), &t));
            assert!(!visited[e.id]);
            visited[e.id] = true;
        }

        let (e1, e2, e3) = (edges[0].borrow(), edges[1].borrow(), edges[2].borrow());
        let (a, b, c) = (vertices[0], vertices[1], vertices[2]);
        assert_eq!(a, e1.start);
        assert_eq!(b, e2.start);
        assert_eq!(c, e3.start);
        assert!(poly.points[a].to_left(&poly.points[b], &poly.points[c]) > 0);
    }

    for e in &result.plane_graph.edges {
        let e = e.borrow();
        if !visited[e.id] {
            assert_eq!(e.start, (e.end + 1) % n);
        }
    }

    for se in result.plane_graph.raw_faces() {
        assert_eq!(Edge::new_edge_iter(&se).count(), 3);
    }
}

fn test_triangulation(algo: Algorithm) {
    let test_path = Path::new(TEST_DIR);
    let test_num = fs::read_dir(test_path.join("polygon")).unwrap().count();
    println!("found {} testcases in {:?}:", test_num, TEST_DIR);
    for i in 0..test_num {
        let poly_file = test_path.join(format!("polygon/{:02}.pts", i));
        println!("{:?}: test triangulation from {:?}", algo, poly_file);

        let poly = Polygon::from_file(poly_file).unwrap();
        let tri = Triangulation::build(&poly, algo);
        validate_result(&poly, tri.result());
    }
}

#[test]
fn ear_cutting() {
    test_triangulation(Algorithm::EarCutting);
}

#[test]
fn mono_partition() {
    test_triangulation(Algorithm::MonoPartition);
}
