use crate::geo::dcel::{Edge, EdgeVec, Face, FaceVec, RcEdge, RcFace, WeakEdge};
use crate::geo::Polygon;

mod ear_cutting;

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

pub struct Triangulation {
    result: TriangulationResult,
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

impl Triangulation {
    pub fn build(poly: &Polygon, algo: Algorithm) -> Self {
        let result = match algo {
            Algorithm::EarCutting => ear_cutting::triangulation(poly),
            _ => unreachable!(),
        };
        Self { result }
    }

    pub fn result(&self) -> &TriangulationResult {
        &self.result
    }

    pub fn build_dual_graph(&self) {}
}
