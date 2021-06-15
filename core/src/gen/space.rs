use rand::Rng;
use serde::Serialize;

use crate::geo::Point;

#[derive(Serialize, Debug, Default)]
pub struct SpacePartitionSteppingResult;

struct SpacePartitionGenerator<'a, R: Rng> {
    n: usize,
    points: &'a [Point],
    idx: Vec<usize>,
    rng: &'a mut R,
}

impl<'a, R: Rng> SpacePartitionGenerator<'a, R> {
    pub fn new(points: &'a [Point], rng: &'a mut R) -> Self {
        let n = points.len();
        Self {
            n,
            idx: (0..n).collect::<Vec<_>>(),
            points,
            rng,
        }
    }

    /// Returns a random point between the segment AB.
    fn random_point_between(a: &Point, b: &Point, rng: &mut impl Rng) -> Point {
        *a + (*b - *a) * rng.gen::<f64>()
    }

    /// Split the point set into a left and a right set by the `line`, returns
    /// the position of `p` (which the line passes through) after partition.
    fn split_points(
        &mut self,
        first: usize,
        last: usize,
        p: usize,
        line: (&Point, &Point),
    ) -> usize {
        self.idx.swap(first, p);
        let mut i = first + 1;
        let mut j = last;
        while i <= j {
            while i <= j && self.points[self.idx[i]].to_left(line.0, line.1) > 0 {
                i += 1;
            }
            while i <= j && self.points[self.idx[j]].to_left(line.0, line.1) < 0 {
                j -= 1;
            }
            if i > j {
                break;
            }
            self.idx.swap(i, j);
            i += 1;
            j -= 1;
        }
        self.idx.swap(first, i - 1);
        i - 1
    }

    fn partition(&mut self, first: usize, last: usize) {
        if first + 1 >= last {
            return;
        }
        let a = self.rng.gen_range(first + 1, last); // pick A randomly.
        let pf = &self.points[self.idx[first]];
        let pl = &self.points[self.idx[last]];
        let pa = self.points[self.idx[a]];

        let line_point = if Point::collinear(pf, pl, &pa) {
            // the first and the last points are collinear, any line through A is OK.
            pa + Point::new(self.rng.gen_range(-1.0, 1.0), self.rng.gen_range(-1.0, 1.0))
        } else {
            // a random line passes through A and intersects the segment.
            Self::random_point_between(pf, pl, &mut self.rng)
        };
        // make sure the first point is to the left of the line.
        let line = if pf.to_left(&line_point, &pa) > 0 {
            (&line_point, &pa)
        } else {
            (&pa, &line_point)
        };

        let b = self.split_points(first + 1, last - 1, a, line);
        self.partition(first, b);
        self.partition(b, last);
    }

    pub fn generate(&mut self) {
        let mut a;
        let mut b;
        loop {
            // make sure no other points are collinear with the initial two points.
            a = self.rng.gen_range(0, self.n);
            b = self.rng.gen_range(0, self.n);
            if a >= b {
                continue;
            }
            let mut ok = true;
            for i in 0..self.n {
                if i == a || i == b {
                    continue;
                }
                if Point::collinear(&self.points[a], &self.points[b], &self.points[i]) {
                    ok = false;
                    break;
                }
            }
            if ok {
                break;
            }
        }

        self.idx.swap(0, a);
        self.idx.push(self.idx[0]);

        let c = self.split_points(1, self.n - 1, b, (&self.points[a], &self.points[b]));
        self.partition(0, c);
        self.partition(c, self.n);

        self.idx.pop();
    }
}

pub fn generate(points: &[Point], rng: &mut impl Rng) -> Vec<usize> {
    let mut sp = SpacePartitionGenerator::new(points, rng);
    sp.generate();
    sp.idx
}

pub fn generate_stepping(
    points: &[Point],
    rng: &mut impl Rng,
) -> (Vec<usize>, SpacePartitionSteppingResult) {
    let mut sp = SpacePartitionGenerator::new(points, rng);
    sp.generate();
    (sp.idx, SpacePartitionSteppingResult)
}
