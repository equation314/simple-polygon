use rand::{prelude::SliceRandom, Rng};
use serde::Serialize;
use std::collections::{hash_map::DefaultHasher, HashSet};
use std::hash::BuildHasherDefault;

use crate::geo::Point;

type RandomState = BuildHasherDefault<DefaultHasher>;

#[derive(Serialize, Debug)]
pub struct TwoOptMovesStep {
    pub e0: Option<(Point, Point)>,
    pub e1: Option<(Point, Point)>,
    pub poly: Option<Vec<Point>>,
}

#[derive(Serialize, Debug, Default)]
pub struct TwoOptMovesSteppingResult {
    pub steps: Vec<TwoOptMovesStep>,
}

impl TwoOptMovesSteppingResult {
    pub fn push_polygon(&mut self, points: &[Point], indices: &[usize]) {
        self.steps.push(TwoOptMovesStep {
            e0: None,
            e1: None,
            poly: Some(indices.iter().map(|&i| points[i]).collect()),
        })
    }

    pub fn push_edges(&mut self, points: &[Point], e0: (usize, usize), e1: (usize, usize)) {
        self.steps.push(TwoOptMovesStep {
            e0: Some((points[e0.0], points[e0.1])),
            e1: Some((points[e1.0], points[e1.1])),
            poly: None,
        })
    }
}

#[derive(Debug)]
struct Intersections {
    count: usize,
    inner: Vec<HashSet<usize, RandomState>>,
}

impl Intersections {
    pub fn new(n: usize) -> Self {
        let hasher = RandomState::default();
        Self {
            count: 0,
            inner: vec![HashSet::with_hasher(hasher); n],
        }
    }

    pub fn len(&self) -> usize {
        self.count
    }

    pub fn is_empty(&self) -> bool {
        self.count == 0
    }

    pub fn add(&mut self, a: usize, b: usize) {
        self.inner[a].insert(b);
        self.inner[b].insert(a);
        self.count += 2;
    }

    pub fn nth(&self, n: usize) -> Option<(usize, usize)> {
        if n >= self.count {
            return None;
        }
        let mut n = n;
        for (i, row) in self.inner.iter().enumerate() {
            if n >= row.len() {
                n -= row.len();
            } else {
                return Some((i, *row.iter().nth(n).unwrap()));
            }
        }
        None
    }

    pub fn remove_related(&mut self, idx: usize) {
        self.count -= self.inner[idx].len();
        self.inner[idx].clear();
        for row in &mut self.inner {
            if row.contains(&idx) {
                row.remove(&idx);
                self.count -= 1;
            }
        }
    }
}

pub fn generate_inner(
    points: &[Point],
    rng: &mut impl Rng,
    stepping: bool,
) -> (Vec<usize>, TwoOptMovesSteppingResult) {
    let mut res = TwoOptMovesSteppingResult::default();

    // use a random permutation as the initial polygon.
    let n = points.len();
    let mut indices = (0..n).collect::<Vec<_>>();
    indices.shuffle(rng);
    if stepping {
        res.push_polygon(points, &indices);
    }

    let mut edges = Vec::with_capacity(n);
    let mut next_edge = Vec::with_capacity(n);
    for i in 0..n {
        edges.push((indices[i], indices[(i + 1) % n]));
        next_edge.push((i + 1) % n);
    }

    let indices_from_edges = |edges: &[(usize, usize)], next_edge: &[usize]| -> Vec<usize> {
        let mut indices = Vec::with_capacity(n);
        let mut e = 0;
        for _ in 0..n {
            indices.push(edges[e].0);
            e = next_edge[e];
        }
        indices
    };

    // find all intersetions at first.
    let mut ints = Intersections::new(n);
    for i in 0..n {
        let a = &points[edges[i].0];
        let b = &points[edges[i].1];
        for j in i + 1..n {
            let c = &points[edges[j].0];
            let d = &points[edges[j].1];
            if Point::segment_intersection(a, b, c, d) {
                ints.add(i, j);
            }
        }
    }

    let mut times = 0;
    while !ints.is_empty() {
        times += 1;

        // pick an intersection randomly.
        let (a, b) = ints.nth(rng.gen_range(0, ints.len())).unwrap();
        ints.remove_related(a);
        ints.remove_related(b);

        let e0 = edges[a];
        let e1 = edges[b];
        edges[a] = (e0.0, e1.0);
        edges[b] = (e0.1, e1.1);
        if stepping {
            res.push_edges(points, e0, e1);
        }

        // reverse edges from a to b.
        let mut prev = b;
        let mut e = next_edge[a];
        while e != b {
            edges[e] = (edges[e].1, edges[e].0);
            let ne = next_edge[e];
            next_edge[e] = prev;
            prev = e;
            e = ne;
        }
        next_edge[a] = prev;
        if stepping {
            res.push_polygon(points, &indices_from_edges(&edges, &next_edge));
        }

        // new intersections of the new two edges.
        let (u1, v1) = (&points[e0.0], &points[e1.0]);
        let (u2, v2) = (&points[e0.1], &points[e1.1]);
        for i in 0..n {
            if i != a && i != b {
                if Point::segment_intersection(u1, v1, &points[edges[i].0], &points[edges[i].1]) {
                    ints.add(a, i);
                }
                if Point::segment_intersection(u2, v2, &points[edges[i].0], &points[edges[i].1]) {
                    ints.add(b, i);
                }
            }
        }
    }

    info!(
        "2-opt Moves: got a simple polygon after {} moves for {} points!",
        times, n
    );
    (indices_from_edges(&edges, &next_edge), res)
}

pub fn generate(points: &[Point], rng: &mut impl Rng) -> Vec<usize> {
    generate_inner(points, rng, false).0
}

pub fn generate_stepping(
    points: &[Point],
    rng: &mut impl Rng,
) -> (Vec<usize>, TwoOptMovesSteppingResult) {
    generate_inner(points, rng, true)
}
