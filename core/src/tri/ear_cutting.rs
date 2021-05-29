use super::TriangulationResult;
use crate::geo::dcel::{Edge, EdgeVec};
use crate::geo::Polygon;

struct EarCutting<'a> {
    poly: &'a Polygon,
    result: TriangulationResult,

    poly_edge: EdgeVec,
    prev_vertex: Vec<usize>,
    next_vertex: Vec<usize>,
}

impl<'a> EarCutting<'a> {
    pub fn new(poly: &'a Polygon) -> Self {
        let n = poly.size();
        let mut ec = Self {
            poly,
            result: TriangulationResult::new(n),
            poly_edge: Vec::with_capacity(n),
            prev_vertex: vec![0; n],
            next_vertex: vec![0; n],
        };

        for i in 0..n {
            let e = ec.result.plane_graph.new_edges(i, (i + 1) % n);
            ec.poly_edge.push(e);
            ec.prev_vertex[i] = (i + n - 1) % n;
            ec.next_vertex[i] = (i + 1) % n;
        }
        ec
    }

    /// Whether the vertex `p` is convex.
    ///
    /// Returns: 1: yes; -1: no; 0: p's neighbors are collinear.
    fn test_convex(&self, p: usize) -> isize {
        let l = self.prev_vertex[p];
        let r = self.next_vertex[p];
        self.poly.points[r].to_left(&self.poly.points[l], &self.poly.points[p])
    }

    /// Whether the vertex `p` is an ear.
    fn is_ear(&self, p: usize) -> bool {
        if self.test_convex(p) <= 0 {
            return false;
        }
        let l = self.prev_vertex[p];
        let r = self.next_vertex[p];
        for (i, point) in self.poly.points.iter().enumerate() {
            if i != p
                && i != l
                && i != r
                && point.in_triangle(
                    &self.poly.points[l],
                    &self.poly.points[p],
                    &self.poly.points[r],
                ) >= 0
            {
                return false;
            }
        }
        true
    }

    /// Add a digonal `l` -- `r`, where `p` is an ear.
    fn add_diagonal(&mut self, l: usize, p: usize, r: usize) {
        let e1 = self.poly_edge[l].clone();
        let e2 = self.poly_edge[p].clone();
        let e3 = if self.poly_edge[r].borrow().end == l {
            self.poly_edge[r].clone()
        } else {
            self.result.new_diagonal(r, l)
        };

        Edge::connect(&e1, &e2);
        Edge::connect(&e2, &e3);
        Edge::connect(&e3, &e1);

        let f = self.result.plane_graph.new_face(&e3);
        e1.borrow_mut().face = Some(f.clone());
        e2.borrow_mut().face = Some(f.clone());
        e3.borrow_mut().face = Some(f);

        self.poly_edge[l] = e3.borrow().twin.upgrade().unwrap();
        self.next_vertex[l] = r;
        self.prev_vertex[r] = l;
    }

    /// Triangulation with the ear-cutting algorithm.
    pub fn triangulation(&mut self) {
        let n = self.poly.size();
        let mut is_ear = vec![false; n];

        for i in 0..n {
            if self.is_ear(i) {
                is_ear[i] = true;
            }
        }

        let mut p = 0;
        while self.result.plane_graph.faces.len() < n - 2 {
            if is_ear[p] {
                let l = self.prev_vertex[p];
                let r = self.next_vertex[p];
                self.add_diagonal(l, p, r);
                is_ear[l] = self.is_ear(l);
                is_ear[r] = self.is_ear(r);
            }
            p = self.next_vertex[p];
        }
    }
}

pub(super) fn triangulation(poly: &Polygon) -> TriangulationResult {
    let mut ec = EarCutting::new(poly);
    ec.triangulation();
    ec.result
}
