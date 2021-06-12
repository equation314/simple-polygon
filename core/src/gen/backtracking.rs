use crate::geo::{Point, Polygon};

struct BacktrackingGenerator<'a> {
    n: usize,
    points: &'a [Point],
    polyline: Vec<usize>,
    visited: Vec<bool>,
    result: Vec<Vec<usize>>,
}

impl<'a> BacktrackingGenerator<'a> {
    pub fn new(points: &'a [Point]) -> Self {
        let n = points.len();
        Self {
            n,
            points,
            polyline: vec![0; n],
            visited: vec![false; n],
            result: Vec::new(),
        }
    }

    fn check_intersection(&self, polyline_len: usize, a: usize, b: usize) -> bool {
        for i in 0..polyline_len - 1 {
            if Point::segment_intersection(
                &self.points[self.polyline[i]],
                &self.points[self.polyline[i + 1]],
                &self.points[a],
                &self.points[b],
            ) {
                return true;
            }
        }
        false
    }

    fn search(&mut self, polyline_len: usize) {
        if polyline_len == self.n {
            if !self.check_intersection(
                polyline_len,
                self.polyline[polyline_len - 1],
                self.polyline[0],
            ) && Polygon::from_indices(self.points, &self.polyline).is_ccw()
            {
                self.result.push(self.polyline.clone());
            }
            return;
        }
        for i in 1..self.n {
            if !self.visited[i]
                && !self.check_intersection(polyline_len, self.polyline[polyline_len - 1], i)
            {
                self.visited[i] = true;
                self.polyline[polyline_len] = i;
                self.search(polyline_len + 1);
                self.visited[i] = false;
            }
        }
    }

    pub fn generate_all(&mut self) {
        self.result.clear();
        self.visited = vec![false; self.n];
        self.search(1);
    }
}

pub fn generate_all(points: &[Point]) -> Vec<Vec<usize>> {
    let mut g = BacktrackingGenerator::new(points);
    g.generate_all();
    println!(
        "Got {} simple polygons for given {} points!",
        g.result.len(),
        points.len()
    );
    g.result
}
