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
    fn new(left_edge_start: &Point, left_edge_end: &Point) -> Self {
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
        (self.x() - other.x()).abs() < Point::EPS
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

    fn new_stalactile(idx: usize, next_edge: RcEdge) -> Self {
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

    /// Add a diagonal (u, v), the previous edge of `u` is `uprev`, and the next
    /// edge if `v` is `vnext`.
    fn add_diagonal(&mut self, u: usize, v: usize, uprev: &RcEdge, vnext: &RcEdge) -> RcEdge {
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

    /// Add a diagonal between the helper and the vertex `u` which at the
    /// bottom of the trapezoid, the previous edge of `u` is `uprev`.
    fn add_diagonal_in_trapezoid(&mut self, tz: &Trapezoid, u: usize, uprev: &RcEdge) -> RcEdge {
        self.add_diagonal(u, tz.helper.idx, uprev, &tz.helper.next_edge)
    }

    /// Monotone partition using plane sweep and trapezoidalization.
    fn trapezoidalization(&mut self) {
        let n = self.poly.size();
        let pts = &self.poly.points;
        let mut idx = (0..n).collect::<Vec<_>>();
        idx.sort_by(|&a, &b| {
            (-pts[a].y, pts[a].x)
                .partial_cmp(&(-pts[b].y, pts[b].x))
                .unwrap()
        });

        let mut status = SweepLineStatus::new(pts);
        let mut visited = vec![false; n];
        for mut p in idx {
            if visited[p] {
                continue;
            }

            // skip horizontal edges
            let (mut l, mut r, mut q) = (p, p, p);
            while (pts[l].y - pts[p].y).abs() < Point::EPS {
                p = l;
                l = (l + n - 1) % n;
                visited[p] = true;
            }
            while (pts[r].y - pts[q].y).abs() < Point::EPS {
                q = r;
                r = (r + 1) % n;
                visited[q] = true;
            }
            assert!((pts[p].y - pts[q].y).abs() < Point::EPS);
            assert!((pts[l].y - pts[p].y).abs() >= Point::EPS);
            assert!((pts[r].y - pts[q].y).abs() >= Point::EPS);
            SWEEP_LINE_Y.with(|y| y.set(pts[p].y));

            let mut e1 = self.poly_edge[l].clone();
            let e2 = self.poly_edge[q].clone();
            let mut e1_next = next!(e1);
            let mut e2_prev = prev!(e2);

            if pts[l].y > pts[p].y && pts[r].y < pts[p].y {
                // left adjacency
                //
                //          Case A              Case B
                //      / e1 ...... |           / e1 . |
                //     / .......... |          / ..... |
                //    p -- q ...... |    q -- p ...... |
                //          \ ..... |     \ .......... |
                //           \ e2 . |      \ e2 ...... |
                //                      (need to add diagonal)
                //
                let old = status.remove(pts[p].x);
                if pts[q].x < pts[p].x {
                    // Case B
                    if old.helper.is_stalactile {
                        self.add_diagonal_in_trapezoid(&old, p, &e1);
                    }
                    // treat p as a stalactile to add the diagonal later.
                    status.insert(e2, old.right, Helper::new_stalactile(p, e1_next));
                } else {
                    // Case A
                    if old.helper.is_stalactile {
                        self.add_diagonal_in_trapezoid(&old, q, &e2_prev);
                    }
                    status.insert(e2.clone(), old.right, Helper::new(q, e2));
                }
            } else if pts[l].y < pts[p].y && pts[r].y > pts[p].y {
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
                let old = status.get_left_mut(pts[p].x);
                if pts[p].x < pts[q].x {
                    // Case B
                    self.add_diagonal_in_trapezoid(&old, p, &e1); // need to add diagonal
                } else if old.helper.is_stalactile {
                    // Case A
                    self.add_diagonal_in_trapezoid(&old, q, &e2_prev);
                }
                e1_next = next!(e1);
                old.modify(e1.clone(), Helper::new(p, e1_next));
            } else if pts[l].y < pts[p].y && pts[r].y < pts[p].y {
                if pts[(p + 1) % n].to_left(&pts[l], &pts[p]) > 0 {
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
                    let left_tz = status.get_left_mut(pts[p].x);
                    let right_edge = left_tz.right.clone();
                    let diagonal = self.add_diagonal_in_trapezoid(left_tz, p, &e1);
                    left_tz.modify(e1, Helper::new(p, diagonal));
                    status.insert(e2.clone(), right_edge, Helper::new(q, e2));
                }
            } else if pts[l].y > pts[p].y && pts[r].y > pts[p].y {
                if pts[(p + 1) % n].to_left(&pts[l], &pts[p]) > 0 {
                    // end vertex
                    //
                    //    \ e1  e2 /
                    //     \ .... /
                    //      p -- q
                    //
                    let tz = status.remove(pts[p].x);
                    if tz.helper.is_stalactile {
                        self.add_diagonal_in_trapezoid(&tz, p, &e1);
                    }
                } else {
                    // stalactile
                    //
                    //    | . e2 \        / e1 . |
                    //    | ..... \      / ..... |
                    //    | ...... q -- p ...... |
                    //    | .................... |
                    //
                    let right_tz = status.remove(pts[p].x);
                    if right_tz.helper.is_stalactile {
                        e1 = twin!(self.add_diagonal_in_trapezoid(&right_tz, p, &e1));
                    }

                    let left_tz = status.get_left_mut(pts[q].x);
                    if left_tz.helper.is_stalactile {
                        e2_prev = prev!(e2);
                        self.add_diagonal_in_trapezoid(&left_tz, q, &e2_prev);
                    }

                    left_tz.modify(right_tz.right, Helper::new_stalactile(p, next!(e1)));
                }
            } else {
                unreachable!();
            }
        }
    }

    // Get two montone chains of the monotone polygon and sort them by y-coordinate.
    fn get_and_sort_mono_chains(&mut self, start_edge: &RcEdge) -> Vec<(usize, u8)> {
        use std::rc::Rc;
        let pts = &self.poly.points;

        let mut top_edge = start_edge.clone();
        for e in Edge::new_edge_iter(start_edge) {
            let start = e.borrow().start;
            let top_start = top_edge.borrow().start;
            self.poly_edge[start] = e.clone();
            if (-pts[start].y, pts[start].x) < (-pts[top_start].y, pts[top_start].x) {
                top_edge = e;
            }
        }

        let mut chain_l = Vec::new();
        let mut chain_r = Vec::new();
        let mut e = top_edge.clone();
        while pts[e.borrow().start].y >= pts[e.borrow().end].y {
            chain_l.push((e.borrow().start, 0));
            e = next!(e);
        }
        while pts[e.borrow().start].y <= pts[e.borrow().end].y && !Rc::ptr_eq(&e, &top_edge) {
            chain_r.push((e.borrow().start, 1));
            e = next!(e);
        }
        chain_r.reverse();

        merge_sorted(&chain_l, &chain_r, |&a, &b| {
            (-pts[a.0].y, pts[a.0].x)
                .partial_cmp(&(-pts[b.0].y, pts[b.0].x))
                .unwrap()
        })
    }

    /// Triangulate a monotone polygon, one of its edge is `start_edge`.
    fn mono_triangulation(&mut self, start_edge: &RcEdge) {
        // get tow montone chains and sort them.
        let sorted_chains = self.get_and_sort_mono_chains(start_edge);

        // triangulate a monotone polygon using a stack.
        let pts = &self.poly.points;
        let mut stack = vec![sorted_chains[0], sorted_chains[1]];
        for &(idx, side) in &sorted_chains[2..] {
            let &(top_idx, top_side) = stack.last().unwrap();
            let mut sp = stack.len();
            if side == top_side {
                // same side
                if top_side == 0 {
                    // left side
                    let mut uprev = prev!(self.poly_edge[idx]);
                    while sp > 1
                        && pts[idx].to_left(&pts[stack[sp - 2].0], &pts[stack[sp - 1].0]) > 0
                    {
                        let v = stack[sp - 2].0;
                        let vnext = self.poly_edge[v].clone();
                        uprev = twin!(self.add_diagonal(idx, v, &uprev, &vnext));
                        stack.pop();
                        sp -= 1;
                    }
                    self.poly_edge[stack[sp - 1].0] = uprev;
                } else {
                    // right side
                    let mut vnext = self.poly_edge[idx].clone();
                    while sp > 1
                        && pts[idx].to_left(&pts[stack[sp - 2].0], &pts[stack[sp - 1].0]) < 0
                    {
                        let u = stack[sp - 2].0;
                        let uprev = prev!(self.poly_edge[u]);
                        vnext = twin!(self.add_diagonal(u, idx, &uprev, &vnext));
                        stack.pop();
                        sp -= 1;
                    }
                    self.poly_edge[idx] = vnext;
                }
                stack.push((idx, side));
            } else {
                // opposite side
                assert!(sp >= 2);
                if top_side == 0 {
                    // left side
                    let uprev = prev!(self.poly_edge[idx]);
                    let mut e = self.poly_edge[idx].clone();
                    for &(v, _) in &stack[1..] {
                        let vnext = self.poly_edge[v].clone();
                        e = self.add_diagonal(idx, v, &uprev, &vnext);
                    }
                    self.poly_edge[idx] = e;
                } else {
                    // right side
                    let vnext = self.poly_edge[idx].clone();
                    let mut e = self.poly_edge[top_idx].clone();
                    for &(u, _) in &stack[1..] {
                        let uprev = prev!(self.poly_edge[u]);
                        e = self.add_diagonal(u, idx, &uprev, &vnext);
                    }
                    self.poly_edge[top_idx] = e;
                }
                stack = vec![(top_idx, top_side), (idx, side)];
            }
        }
    }

    pub fn triangulation(&mut self) {
        self.trapezoidalization();

        for start_edge in self.result.plane_graph.raw_faces().collect::<Vec<_>>() {
            self.mono_triangulation(&start_edge);
        }

        for start_edge in self.result.plane_graph.raw_faces().collect::<Vec<_>>() {
            let mut iter = Edge::new_edge_iter(&start_edge);
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

fn merge_sorted<T, F>(a: &[T], b: &[T], compare: F) -> Vec<T>
where
    T: Copy,
    F: Fn(&T, &T) -> Ordering,
{
    let len_a = a.len();
    let len_b = b.len();
    let mut res = Vec::with_capacity(len_a + len_b);
    let mut p = 0;
    let mut q = 0;

    while p < len_a || q < len_b {
        if p < len_a && compare(&a[p], &b[q]) == Ordering::Less {
            res.push(a[p]);
            p += 1;
        } else {
            res.push(b[q]);
            q += 1;
        }
    }

    res
}

pub(super) fn triangulation(poly: &Polygon) -> TriangulationResult {
    let mut mp = MonoPartition::new(poly);
    mp.triangulation();
    mp.result
}
