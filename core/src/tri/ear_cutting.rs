use std::collections::VecDeque;
use std::rc::Rc;

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
            result: TriangulationResult::default(),
            poly_edge: Vec::with_capacity(n),
            prev_vertex: vec![0; n],
            next_vertex: vec![0; n],
        };

        for i in 0..n {
            let e = ec.result.new_edges(i, (i + 1) % n);
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
        self.poly.points[r].to_left(self.poly.points[l], self.poly.points[p])
    }

    /// Whether the vertex `p` is an ear.
    fn is_ear(&self, p: usize) -> bool {
        if self.test_convex(p) <= 0 {
            return false;
        }
        let l = self.prev_vertex[p];
        let r = self.next_vertex[p];
        for i in 0..self.poly.size() {
            if i != p
                && i != l
                && i != r
                && self.poly.points[i].in_triangle(
                    self.poly.points[l],
                    self.poly.points[p],
                    self.poly.points[r],
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

        let f = Rc::downgrade(&self.result.new_face(Rc::downgrade(&e3)));
        e1.borrow_mut().face = f.clone();
        e2.borrow_mut().face = f.clone();
        e3.borrow_mut().face = f;

        self.poly_edge[l] = e3.borrow().twin.upgrade().unwrap();
        self.next_vertex[l] = r;
        self.prev_vertex[r] = l;
    }

    /// Triangulation with the ear-cutting algorithm.
    pub fn triangulation(&mut self) {
        let n = self.poly.size();
        let mut queue = VecDeque::new();
        let mut in_queue = vec![false; n];

        for i in 0..n {
            if self.is_ear(i) {
                queue.push_back(i);
                in_queue[i] = true;
            }
        }

        while self.result.triangles.len() < n - 2 && !queue.is_empty() {
            let p = queue.pop_front().unwrap();
            if !in_queue[p] {
                continue;
            }

            let l = self.prev_vertex[p];
            let r = self.next_vertex[p];
            self.add_diagonal(l, p, r);

            if self.is_ear(l) {
                if !in_queue[l] {
                    queue.push_back(l);
                }
                in_queue[l] = true;
            } else {
                in_queue[l] = false;
            }

            if self.is_ear(r) {
                if !in_queue[r] {
                    queue.push_back(r);
                }
                in_queue[r] = true;
            } else {
                in_queue[r] = false;
            }
        }
    }
}

pub(super) fn triangulation(poly: &Polygon) -> TriangulationResult {
    let mut ec = EarCutting::new(poly);
    ec.triangulation();
    ec.result
}
