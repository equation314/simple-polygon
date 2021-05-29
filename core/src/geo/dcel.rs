//! Doubly Connected Edge List structures

use std::cell::RefCell;
use std::rc::{Rc, Weak};

use crate::graph::Graph;

pub struct Edge {
    pub id: usize,
    pub start: usize,
    pub end: usize,

    pub twin: WeakEdge,
    pub prev: WeakEdge,
    pub next: WeakEdge,
    pub face: Option<RcFace>,
}

#[derive(Debug)]
pub struct Face {
    pub id: usize,
    pub first_edge: WeakEdge,
}

pub type RcEdge = Rc<RefCell<Edge>>;
pub type WeakEdge = Weak<RefCell<Edge>>;
pub type EdgeVec = Vec<RcEdge>;

pub type RcFace = Rc<Face>;
pub type FaceVec = Vec<RcFace>;

macro_rules! twin {
    ($e: expr) => {
        $e.borrow().twin.upgrade().unwrap()
    };
}

macro_rules! prev {
    ($e: expr) => {
        $e.borrow().prev.upgrade().unwrap()
    };
}

macro_rules! next {
    ($e: expr) => {
        $e.borrow().next.upgrade().unwrap()
    };
}

pub(crate) use {next, prev, twin};

impl Edge {
    pub fn new(id: usize, start: usize, end: usize) -> Self {
        Self {
            id,
            start,
            end,
            twin: Weak::new(),
            prev: Weak::new(),
            next: Weak::new(),
            face: None,
        }
    }

    pub fn new_twin(id: usize, start: usize, end: usize) -> (RcEdge, RcEdge) {
        let e1 = Rc::new(RefCell::new(Self::new(id, start, end)));
        let e2 = Rc::new(RefCell::new(Self::new(id + 1, end, start)));
        e1.borrow_mut().twin = Rc::downgrade(&e2);
        e2.borrow_mut().twin = Rc::downgrade(&e1);
        (e1, e2)
    }

    pub fn connect(e1: &RcEdge, e2: &RcEdge) {
        e1.borrow_mut().next = Rc::downgrade(&e2);
        e2.borrow_mut().prev = Rc::downgrade(&e1);
    }

    pub fn as_iter(edge: &RcEdge) -> EdgeIter {
        EdgeIter::new(Rc::downgrade(edge))
    }
}

impl std::fmt::Debug for Edge {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        f.debug_struct("Edge")
            .field("id", &self.id)
            .field("start", &self.start)
            .field("end", &self.end)
            .finish()
    }
}

impl Face {
    pub fn new(id: usize, edge: WeakEdge) -> RcFace {
        Rc::new(Self {
            id,
            first_edge: edge,
        })
    }

    pub fn edges(&self) -> EdgeIter {
        EdgeIter::new(self.first_edge.clone())
    }

    pub fn vertices(&self) -> impl Iterator<Item = usize> {
        self.edges().into_vertex_iter()
    }
}

pub struct EdgeIter {
    start: WeakEdge,
    current: WeakEdge,
    stopped: bool,
}

impl EdgeIter {
    pub fn new(start: WeakEdge) -> Self {
        Self {
            current: start.clone(),
            start,
            stopped: false,
        }
    }

    pub fn into_vertex_iter(self) -> impl Iterator<Item = usize> {
        self.map(|e| e.borrow().start)
    }
}

impl Iterator for EdgeIter {
    type Item = RcEdge;
    fn next(&mut self) -> Option<Self::Item> {
        if self.stopped {
            None
        } else {
            if let Some(e) = self.current.upgrade() {
                self.current = e.borrow().next.clone();
                if self.current.ptr_eq(&self.start) {
                    self.stopped = true;
                }
                Some(e)
            } else {
                None
            }
        }
    }
}

pub struct FaceIter<'a> {
    current_edge_idx: usize,
    edges: &'a EdgeVec,
    visited: Vec<bool>,
}

impl<'a> FaceIter<'a> {
    fn new(edges: &'a EdgeVec) -> Self {
        Self {
            current_edge_idx: 0,
            edges,
            visited: vec![false; edges.len()],
        }
    }
}

impl<'a> Iterator for FaceIter<'a> {
    type Item = &'a RcEdge;
    fn next(&mut self) -> Option<Self::Item> {
        while self.current_edge_idx < self.edges.len() {
            let start = &self.edges[self.current_edge_idx];
            if !self.visited[start.borrow().id] && start.borrow().next.upgrade().is_some() {
                for e in Edge::as_iter(start) {
                    self.visited[e.borrow().id] = true;
                }
                return Some(&start);
            }
            self.current_edge_idx += 1;
        }
        None
    }
}

#[derive(Debug)]
pub struct PlaneGraph {
    pub n: usize,
    pub edges: EdgeVec,
    pub faces: FaceVec,
}

impl PlaneGraph {
    pub fn new(n: usize) -> Self {
        Self {
            n,
            edges: Vec::new(),
            faces: Vec::new(),
        }
    }

    /// Add two twin half-edges.
    pub fn new_edges(&mut self, start: usize, end: usize) -> RcEdge {
        let (e1, e2) = Edge::new_twin(self.edges.len(), start, end);
        self.edges.push(e1.clone());
        self.edges.push(e2);
        e1
    }

    /// Add a face with the incident edge.
    pub fn new_face(&mut self, edge: &RcEdge) -> RcFace {
        let f = Face::new(self.faces.len(), Rc::downgrade(edge));
        self.faces.push(f.clone());
        f
    }

    /// Build the dual graph of the plane graph.
    pub fn build_dual_graph(&self) -> Graph<RcEdge> {
        let mut dual = Graph::new(self.n);
        for e in &self.edges {
            if let Some(ref f1) = e.borrow().face {
                if let Some(ref f2) = twin!(e).borrow().face {
                    dual.add_edge(f1.id, f2.id, e.clone());
                }
            }
        }
        dual
    }

    pub fn raw_faces(&self) -> FaceIter {
        FaceIter::new(&self.edges)
    }
}
