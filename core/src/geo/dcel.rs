//! Doubly Connected Edge List structures

use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
pub struct Edge {
    pub start: usize,
    pub end: usize,
    pub twin: WeakEdge,
    pub prev: WeakEdge,
    pub next: WeakEdge,
    pub face: WeakFace,
}

#[derive(Debug)]
pub struct Face {
    pub id: usize,
    pub first_edge: WeakEdge,
}

pub type RcEdge = Rc<RefCell<Edge>>;
pub type WeakEdge = Weak<RefCell<Edge>>;
pub type EdgeVec = Vec<RcEdge>;

pub type RcFace = Rc<RefCell<Face>>;
pub type WeakFace = Weak<RefCell<Face>>;
pub type FaceVec = Vec<RcFace>;

impl Edge {
    pub fn new(start: usize, end: usize) -> Self {
        Self {
            start,
            end,
            twin: Weak::new(),
            prev: Weak::new(),
            next: Weak::new(),
            face: Weak::new(),
        }
    }

    pub fn new_twin(start: usize, end: usize) -> (RcEdge, RcEdge) {
        let e1 = Rc::new(RefCell::new(Self::new(start, end)));
        let e2 = Rc::new(RefCell::new(Self::new(end, start)));
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
        Rc::new(RefCell::new(Self {
            id,
            first_edge: edge,
        }))
    }
}
