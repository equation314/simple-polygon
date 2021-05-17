use crate::geo::dcel::{Edge, EdgeVec, Face, FaceVec, RcEdge, RcFace, WeakEdge};
use crate::geo::{Point, Polygon};

mod ear_cutting;
mod graph;

use graph::Graph;

#[derive(Clone, Copy)]
pub enum Algorithm {
    EarCutting,
    MonoDecomposition,
}

#[derive(Debug)]
pub struct TriangulationResult {
    pub diagonals: Vec<(usize, usize)>,
    pub edges: EdgeVec,
    pub triangles: FaceVec,
}

pub struct Triangulation<'a> {
    poly: &'a Polygon,
    result: TriangulationResult,
    dual: Graph<RcEdge>,
}

impl TriangulationResult {
    /// Add two twin half-edges.
    pub fn new_edges(&mut self, start: usize, end: usize) -> RcEdge {
        let (e1, e2) = Edge::new_twin(self.edges.len(), start, end);
        self.edges.push(e1.clone());
        self.edges.push(e2);
        e1
    }

    /// Add a diagonal, will add two half-edges first.
    pub fn new_diagonal(&mut self, start: usize, end: usize) -> RcEdge {
        let e = self.new_edges(start, end);
        self.diagonals.push((start, end));
        e
    }

    /// Add a face with the incident edge.
    pub fn new_face(&mut self, edge: WeakEdge) -> RcFace {
        let f = Face::new(self.triangles.len(), edge);
        self.triangles.push(f.clone());
        f
    }
}

impl Default for TriangulationResult {
    fn default() -> Self {
        Self {
            diagonals: Vec::new(),
            edges: Vec::new(),
            triangles: Vec::new(),
        }
    }
}

impl<'a> Triangulation<'a> {
    pub fn build(poly: &'a Polygon, algo: Algorithm) -> Self {
        let result = match algo {
            Algorithm::EarCutting => ear_cutting::triangulation(poly),
            _ => unreachable!(),
        };
        Self {
            poly,
            result,
            dual: Graph::new(poly.size()),
        }
    }

    pub fn result(&self) -> &TriangulationResult {
        &self.result
    }

    pub fn dual(&self) -> &Graph<RcEdge> {
        &self.dual
    }

    pub fn build_dual_graph(&mut self) {
        for e in &self.result.edges {
            if let Some(ref f1) = e.borrow().face {
                if let Some(ref f2) = e.borrow().twin.upgrade().unwrap().borrow().face {
                    self.dual.add_edge(f1.id, f2.id, e.clone());
                }
            }
        }
    }

    pub fn location(&self, point: Point) -> Option<RcFace> {
        for t in &self.result.triangles {
            let mut iter = t.vertices();
            let a = iter.next().unwrap();
            let b = iter.next().unwrap();
            let c = iter.next().unwrap();
            if point.in_triangle(
                self.poly.points[a],
                self.poly.points[b],
                self.poly.points[c],
            ) >= 0
            {
                return Some(t.clone());
            }
        }
        None
    }
}
