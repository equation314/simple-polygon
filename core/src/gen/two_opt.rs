use rand::{prelude::SliceRandom, Rng};
use std::collections::HashSet;

use crate::geo::Point;

#[derive(Debug)]
struct Intersections {
    count: usize,
    inner: Vec<HashSet<usize>>,
}

impl Intersections {
    pub fn new(n: usize) -> Self {
        Self {
            count: 0,
            inner: vec![HashSet::new(); n],
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

pub fn generate(points: &[Point], rng: &mut impl Rng) -> Vec<usize> {
    // use a random permutation as the initial polygon.
    let n = points.len();
    let mut indices = (0..n).collect::<Vec<_>>();
    indices.shuffle(rng);

    let mut edges = Vec::with_capacity(n);
    let mut next_edge = Vec::with_capacity(n);
    for i in 0..n {
        edges.push((indices[i], indices[(i + 1) % n]));
        next_edge.push((i + 1) % n);
    }

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

        let e1 = edges[a];
        let e2 = edges[b];
        edges[a] = (e1.0, e2.0);
        edges[b] = (e1.1, e2.1);

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

        // new intersections of the new two edges.
        let (u1, v1) = (&points[e1.0], &points[e2.0]);
        let (u2, v2) = (&points[e1.1], &points[e2.1]);
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

    let mut indices = Vec::with_capacity(n);
    let mut e = 0;
    for _ in 0..n {
        indices.push(edges[e].0);
        e = next_edge[e];
    }

    println!(
        "2-opt Moves: got a simple polygon after {} moves for {} points!",
        times, n
    );
    indices
}
