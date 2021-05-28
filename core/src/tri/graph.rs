use std::collections::VecDeque;

/// An edge of the graph.
#[derive(Clone, Debug)]
pub struct GraphEdge<T> {
    pub u: usize,
    pub v: usize,
    pub weight: T,
}

/// A directed graph with weight type `T`.
pub struct Graph<T> {
    n: usize,
    edges: Vec<Vec<GraphEdge<T>>>,
}

impl<T: Clone> Graph<T> {
    pub fn new(n: usize) -> Self {
        Self {
            n,
            edges: vec![Vec::new(); n],
        }
    }

    /// Add a directed edge to the graph.
    pub fn add_edge(&mut self, u: usize, v: usize, weight: T) {
        self.edges[u].push(GraphEdge { u, v, weight })
    }

    /// Find the shortest path in the graph using BFS.
    pub fn find_path(&self, start: usize, target: usize) -> Option<Vec<GraphEdge<T>>> {
        let mut path = Vec::new();
        let mut visited = vec![None; self.n];
        let mut queue = VecDeque::with_capacity(self.n);

        queue.push_back(start);
        while !queue.is_empty() {
            let u = queue.pop_front().unwrap();
            for e in &self.edges[u] {
                if visited[e.v].is_none() {
                    visited[e.v] = Some(e.clone());
                    queue.push_back(e.v);
                    if e.v == target {
                        queue.clear();
                        break;
                    }
                }
            }
        }

        let mut p = target;
        while p != start {
            if let Some(ref e) = visited[p] {
                path.push(e.clone());
                p = e.u;
            } else {
                return None;
            }
        }
        path.reverse();
        Some(path)
    }
}
