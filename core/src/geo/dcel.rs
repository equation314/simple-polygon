//! Doubly Connected Edge List structures

use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
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
        self.map(|e| e.borrow().end)
    }
}

impl Iterator for EdgeIter {
    type Item = RcEdge;
    fn next(&mut self) -> Option<Self::Item> {
        if self.stopped {
            None
        } else {
            let e = self.current.upgrade().unwrap();
            self.current = e.borrow().next.clone();
            if self.current.ptr_eq(&self.start) {
                self.stopped = true;
            }
            Some(e)
        }
    }
}
