use std::cell::Cell;
use std::cmp::Ordering;
use std::collections::BTreeMap;

use super::TriangulationResult;
use crate::geo::dcel::{next, prev, twin, Edge, EdgeVec, RcEdge};
use crate::geo::{Point, Polygon};

thread_local! {
    static SWEEP_LINE_Y: Cell<f64> = Cell::new(0.0);
}

#[derive(Debug)]
struct TrapezoidKey {
    k: f64,
    b: f64,
}

impl TrapezoidKey {
    const EPS: f64 = 1e-9;

    fn new(left_edge_start: &Point, left_edge_end: &Point) -> Self {
        assert_ne!(left_edge_start.y, left_edge_end.y);
        let k = (left_edge_end.x - left_edge_start.x) / (left_edge_end.y - left_edge_start.y);
        Self {
            k,
            b: left_edge_end.x - k * left_edge_end.y,
        }
    }

    fn from_x(x: f64) -> Self {
        Self { k: 0.0, b: x }
    }

    fn x(&self) -> f64 {
        self.k * SWEEP_LINE_Y.with(|y| y.get()) + self.b
    }
}

impl Ord for TrapezoidKey {
    fn cmp(&self, other: &Self) -> Ordering {
        self.partial_cmp(other).unwrap()
    }
}

impl PartialOrd for TrapezoidKey {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        if self.eq(other) {
            Some(Ordering::Equal)
        } else {
            self.x().partial_cmp(&other.x())
        }
    }
}

impl PartialEq for TrapezoidKey {
    fn eq(&self, other: &Self) -> bool {
        (self.x() - other.x()).abs() < Self::EPS
    }
}

impl Eq for TrapezoidKey {}

#[derive(Debug)]
struct Helper {
    /// The vertex index of the helper.
    idx: usize,
    /// The next edge of the diagonal if it was added to connect some vertex and the helper.
    next_edge: RcEdge,
    /// Is the helper vertex a stalactile?
    is_stalactile: bool,
}

impl Helper {
    fn new(idx: usize, next_edge: RcEdge) -> Self {
        Self {
            idx,
            next_edge,
            is_stalactile: false,
        }
    }

    fn from_stalactile(idx: usize, next_edge: RcEdge) -> Self {
        Self {
            idx,
            next_edge,
            is_stalactile: true,
        }
    }
}

#[derive(Debug)]
struct Trapezoid {
    /// The left edge of the trapezoid.
    left: RcEdge,
    /// The right edge of the trapezoid.
    right: RcEdge,
    /// The helper vertex used to add a diagonal.
    helper: Helper,
}

impl Trapezoid {
    fn new(left: RcEdge, right: RcEdge, helper: Helper) -> Self {
        Self {
            left,
            right,
            helper,
        }
    }

    fn modify(&mut self, right: RcEdge, helper: Helper) {
        self.right = right;
        self.helper = helper;
    }
}

struct SweepLineStatus<'a> {
    points: &'a [Point],
    status: BTreeMap<TrapezoidKey, Trapezoid>,
}

impl<'a> SweepLineStatus<'a> {
    fn new(points: &'a [Point]) -> Self {
        Self {
            points,
            status: BTreeMap::new(),
        }
    }

    fn insert(&mut self, left: RcEdge, right: RcEdge, helper: Helper) {
        let start = left.borrow().start;
        let end = left.borrow().end;
        let k = TrapezoidKey::new(&self.points[start], &self.points[end]);
        let t = Trapezoid::new(left, right, helper);
        assert!(self.status.insert(k, t).is_none());
    }

    /// Remove and return the trapezoid whose left edge is exactly on `x` with the current sweep line.
    fn remove(&mut self, x: f64) -> Trapezoid {
        self.status.remove(&TrapezoidKey::from_x(x)).unwrap()
    }

    /// Get the first trapezoid to the left of the given `x` coordinate.
    fn get_left_mut(&mut self, x: f64) -> &mut Trapezoid {
        self.status
            .range_mut(..=TrapezoidKey::from_x(x))
            .last()
            .unwrap()
            .1
    }
}

struct MonoPartition<'a> {
    poly: &'a Polygon,
    result: TriangulationResult,
    poly_edge: EdgeVec,
}

impl<'a> MonoPartition<'a> {
    pub fn new(poly: &'a Polygon) -> Self {
        let n = poly.size();
        let mut mp = Self {
            poly,
            result: TriangulationResult::new(n),
            poly_edge: Vec::with_capacity(n),
        };
        for i in 0..n {
            mp.poly_edge
                .push(mp.result.plane_graph.new_edges(i, (i + 1) % n));
        }
        for i in 0..n {
            Edge::connect(&mp.poly_edge[i], &mp.poly_edge[(i + 1) % n])
        }
        mp
    }

    /// Add a diagonal between the helper and the vertex `u` which at the
    /// bottom of the trapezoid, the previous edge of `u` is `uprev`.
    fn add_diagonal(&mut self, tz: &Trapezoid, u: usize, uprev: &RcEdge) -> RcEdge {
        // Add a diagonal (u, v), the previous edge of `u` is `uprev`, and the next edge if `v` is `vnext`.
        let v = tz.helper.idx;
        println!("DIAGONAL {} {}", u, v);
        let vnext = &tz.helper.next_edge;
        let unext = &next!(uprev);
        let vprev = &prev!(vnext);
        if uprev.borrow().start == v {
            return uprev.clone();
        }
        if unext.borrow().end == v {
            return unext.clone();
        }
        let e1 = self.result.new_diagonal(u, v);
        let e2 = twin!(e1);
        Edge::connect(uprev, &e1);
        Edge::connect(&e2, unext);
        Edge::connect(&e1, vnext);
        Edge::connect(vprev, &e2);
        e1
    }

    /// Monotone partition using plane sweep and trapezoidalization.
    fn trapezoidalization(&mut self) {
        let n = self.poly.size();
        let points = &self.poly.points;
        let mut idx = (0..n).collect::<Vec<_>>();
        idx.sort_by(|&a, &b| {
            (-points[a].y, points[a].x)
                .partial_cmp(&(-points[b].y, points[b].x))
                .unwrap()
        });

        let mut status = SweepLineStatus::new(points);
        let mut visited = vec![false; n];
        for mut p in idx {
            if visited[p] {
                continue;
            }

            // skip horizontal edges
            let (mut l, mut r, mut q) = (p, p, p);
            while points[l].y == points[p].y {
                p = l;
                l = (l + n - 1) % n;
                visited[p] = true;
            }
            while points[r].y == points[q].y {
                q = r;
                r = (r + 1) % n;
                visited[q] = true;
            }
            assert_eq!(points[p].y, points[q].y);
            assert_ne!(points[l].y, points[p].y);
            assert_ne!(points[r].y, points[q].y);
            SWEEP_LINE_Y.with(|y| y.set(points[p].y));
            println!("{} {} {}   {:?}", p, l, r, SWEEP_LINE_Y.with(|y| y.get()));

            let mut e1 = self.poly_edge[l].clone();
            let e2 = self.poly_edge[q].clone();
            let mut e1_next = next!(e1);
            let mut e2_prev = prev!(e2);

            if points[l].y > points[p].y && points[r].y < points[p].y {
                // left adjacency
                //
                //          Case A              Case B
                //      / e1 ...... |           / e1 . |
                //     / .......... |          / ..... |
                //    p -- q ...... |    q -- p ...... |
                //          \ ..... |     \ .......... |
                //           \ e2 . |      \ e2 ...... |
                // (need to add diagonal)
                //
                let old = status.remove(points[p].x);
                if points[p].x < points[q].x {
                    // Case A
                    self.add_diagonal(&old, q, &e2_prev); // need to add diagonal
                    status.insert(e2.clone(), old.right, Helper::new(q, e2));
                } else {
                    // Case B
                    if old.helper.is_stalactile {
                        self.add_diagonal(&old, p, &e1);
                    }
                    status.insert(e2, old.right, Helper::new(p, e1_next));
                }
            } else if points[l].y < points[p].y && points[r].y > points[p].y {
                // right adjacency
                //
                //      Case A              Case B
                //    | . e2 \           | ...... e2 \
                //    | ..... \          | .......... \
                //    | ...... q -- p    | ...... p -- q
                //    | .......... /     | ..... /
                //    | ...... e1 /      | . e1 /
                //                       (need to add diagonal)
                //
                let old = status.get_left_mut(points[p].x);
                if points[p].x < points[q].x {
                    // Case B
                    self.add_diagonal(&old, p, &e1); // need to add diagonal
                } else if old.helper.is_stalactile {
                    // Case A
                    self.add_diagonal(&old, q, &e2_prev);
                }
                e1_next = next!(e1);
                old.modify(e1.clone(), Helper::new(p, e1_next));
            } else if points[l].y < points[p].y && points[r].y < points[p].y {
                if points[(p + 1) % n].to_left(&points[l], &points[p]) > 0 {
                    // start vertex
                    //
                    //      q -- p
                    //     / .... \
                    //    / e2  e1 \
                    //
                    status.insert(e2.clone(), e1, Helper::new(q, e2));
                } else {
                    // stalagmite
                    //
                    //    | .................... |
                    //    | ...... p -- q ...... |
                    //    | ..... /      \ ..... |
                    //    | . e1 /        \ e2 . |
                    //
                    let left_tz = status.get_left_mut(points[p].x);
                    let right_edge = left_tz.right.clone();
                    let d = self.add_diagonal(left_tz, p, &e1);
                    left_tz.modify(e1, Helper::new(p, d));
                    status.insert(e2.clone(), right_edge, Helper::new(q, e2));
                }
            } else if points[l].y > points[p].y && points[r].y > points[p].y {
                if points[(p + 1) % n].to_left(&points[l], &points[p]) > 0 {
                    // end vertex
                    //
                    //    \ e1  e2 /
                    //     \ .... /
                    //      p -- q
                    //
                    let tz = status.remove(points[p].x);
                    if tz.helper.is_stalactile {
                        self.add_diagonal(&tz, p, &e1);
                    }
                } else {
                    // stalactile
                    //
                    //    | . e2 \        / e1 . |
                    //    | ..... \      / ..... |
                    //    | ...... q -- p ...... |
                    //    | .................... |
                    //
                    let right_tz = status.remove(points[p].x);
                    if right_tz.helper.is_stalactile {
                        e1 = twin!(self.add_diagonal(&right_tz, p, &e1));
                    }

                    let left_tz = status.get_left_mut(points[q].x);
                    if left_tz.helper.is_stalactile {
                        e2_prev = prev!(e2);
                        self.add_diagonal(&left_tz, q, &e2_prev);
                    }

                    left_tz.modify(right_tz.right, Helper::from_stalactile(p, next!(e1)));
                }
            } else {
                unreachable!();
            }
            // println!("{:?}", status.status.values());
        }
    }

    /// Triangulate a monotone polygon, one of its edge is `start_edge`.
    fn mono_triangulation(&mut self, start_edge: &RcEdge) {
        println!("{:?}", start_edge);
        println!(
            "{:?}",
            Edge::as_iter(&start_edge)
                .into_vertex_iter()
                .collect::<Vec<_>>()
        );
    }

    pub fn triangulation(&mut self) {
        self.trapezoidalization();

        for start_edge in self
            .result
            .plane_graph
            .raw_faces()
            .cloned()
            .collect::<Vec<_>>()
        {
            self.mono_triangulation(&start_edge);
        }

        for start_edge in self
            .result
            .plane_graph
            .raw_faces()
            .cloned()
            .collect::<Vec<_>>()
        {
            let mut iter = Edge::as_iter(&start_edge);
            let e1 = iter.next().unwrap();
            let e2 = iter.next().unwrap();
            let e3 = iter.next().unwrap();
            assert!(iter.next().is_none());
            let f = self.result.plane_graph.new_face(&e1.clone());
            e1.borrow_mut().face = Some(f.clone());
            e2.borrow_mut().face = Some(f.clone());
            e3.borrow_mut().face = Some(f);
        }
    }
}

pub(super) fn triangulation(poly: &Polygon) -> TriangulationResult {
    let mut mp = MonoPartition::new(poly);
    mp.triangulation();
    mp.result
}
