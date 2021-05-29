use crate::geo::dcel::{PlaneGraph, RcEdge, RcFace};
use crate::geo::{Point, Polygon};

mod ear_cutting;

#[derive(Clone, Copy)]
pub enum Algorithm {
    EarCutting,
    MonoPartition,
}

#[derive(Debug)]
pub struct TriangulationResult {
    pub diagonals: Vec<(usize, usize)>,
    pub plane_graph: PlaneGraph,
}

pub struct Triangulation<'a> {
    poly: &'a Polygon,
    result: TriangulationResult,
}

impl TriangulationResult {
    pub fn new(n: usize) -> Self {
        Self {
            diagonals: Vec::with_capacity(n - 3),
            plane_graph: PlaneGraph::new(n),
        }
    }

    /// Add a diagonal, will add two half-edges first.
    pub fn new_diagonal(&mut self, start: usize, end: usize) -> RcEdge {
        let e = self.plane_graph.new_edges(start, end);
        self.diagonals.push((start, end));
        e
    }
}

impl<'a> Triangulation<'a> {
    pub fn build(poly: &'a Polygon, algo: Algorithm) -> Self {
        let result = match algo {
            Algorithm::EarCutting => ear_cutting::triangulation(poly),
            _ => unreachable!(),
        };
        Self { poly, result }
    }

    pub fn result(&self) -> &TriangulationResult {
        &self.result
    }

    /// Find the triangle contains the given `point`.
    pub fn location(&self, point: &Point) -> Option<RcFace> {
        for t in &self.result.plane_graph.faces {
            let mut iter = t.vertices();
            let a = iter.next().unwrap();
            let b = iter.next().unwrap();
            let c = iter.next().unwrap();
            if point.in_triangle(
                &self.poly.points[a],
                &self.poly.points[b],
                &self.poly.points[c],
            ) >= 0
            {
                return Some(t.clone());
            }
        }
        None
    }
}
