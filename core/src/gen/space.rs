use rand::Rng;
use serde::Serialize;

use crate::geo::Point;

#[derive(Serialize, Debug)]
pub struct SpacePartitionStep {
    pub base_segment: (Point, Point),
    pub mid_point: Option<Point>,
    pub split_line: Option<(Point, Point)>,

    pub left_points: Vec<Point>,
    pub right_points: Vec<Point>,

    pub current_chain_len: usize,
    pub is_leaf: bool,
}

#[derive(Serialize, Debug, Default)]
pub struct SpacePartitionSteppingResult {
    pub points: Vec<Point>,
    pub polygon: Vec<Point>,
    pub steps: Vec<SpacePartitionStep>,
}

impl SpacePartitionSteppingResult {
    pub fn new(points: &[Point]) -> Self {
        Self {
            points: points.to_vec(),
            polygon: vec![],
            steps: vec![],
        }
    }

    fn get_current_chain_len(&self) -> usize {
        if let Some(last) = self.steps.last() {
            if last.is_leaf {
                last.current_chain_len + 1
            } else {
                last.current_chain_len
            }
        } else {
            1
        }
    }

    pub fn push_unsplitted(&mut self, base_segment: (Point, Point), sub_points: Vec<Point>) {
        self.steps.push(SpacePartitionStep {
            base_segment,
            mid_point: None,
            split_line: None,
            left_points: sub_points,
            right_points: vec![],
            current_chain_len: self.get_current_chain_len(),
            is_leaf: false,
        });
    }

    pub fn push_splitted(
        &mut self,
        base_segment: (Point, Point),
        mid_point: Point,
        split_line: (Point, Point),
        left_points: Vec<Point>,
        right_points: Vec<Point>,
    ) {
        self.steps.push(SpacePartitionStep {
            base_segment,
            mid_point: Some(mid_point),
            split_line: Some(split_line),
            left_points,
            right_points,
            current_chain_len: self.get_current_chain_len(),
            is_leaf: false,
        });
    }

    pub fn push_leaf(&mut self, base_segment: (Point, Point)) {
        self.steps.push(SpacePartitionStep {
            base_segment,
            mid_point: None,
            split_line: None,
            left_points: vec![],
            right_points: vec![],
            current_chain_len: self.get_current_chain_len(),
            is_leaf: true,
        });
    }
}

struct SpacePartitionGenerator<'a, R: Rng> {
    n: usize,
    points: &'a [Point],
    idx: Vec<usize>,
    rng: &'a mut R,

    stepping: bool,
    res: SpacePartitionSteppingResult,
}

impl<'a, R: Rng> SpacePartitionGenerator<'a, R> {
    pub fn new(points: &'a [Point], rng: &'a mut R, stepping: bool) -> Self {
        let n = points.len();
        Self {
            n,
            idx: (0..n).collect::<Vec<_>>(),
            points,
            rng,
            stepping,
            res: if stepping {
                SpacePartitionSteppingResult::new(points)
            } else {
                Default::default()
            },
        }
    }

    fn collect_points(&self, first: usize, last: usize) -> Vec<Point> {
        self.idx[first..last + 1]
            .iter()
            .map(|&i| self.points[i])
            .collect()
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
        line: &(Point, Point),
    ) -> usize {
        self.idx.swap(first, p);
        let mut i = first + 1;
        let mut j = last;
        while i <= j {
            while i <= j && self.points[self.idx[i]].to_left(&line.0, &line.1) > 0 {
                i += 1;
            }
            while i <= j && self.points[self.idx[j]].to_left(&line.0, &line.1) < 0 {
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
        let pf = self.points[self.idx[first]];
        let pl = self.points[self.idx[last]];
        if self.stepping {
            self.res
                .push_unsplitted((pf, pl), self.collect_points(first, last));
        }

        if first + 1 >= last {
            if self.stepping {
                self.res.push_leaf((pf, pl));
            }
            return;
        }

        let mid = self.rng.gen_range(first + 1, last); // pick A randomly.
        let pm = self.points[self.idx[mid]];

        let line_point = if Point::collinear(&pf, &pl, &pm) {
            // the first and the last points are collinear, any line through A is OK.
            pm + Point::new(self.rng.gen_range(-1.0, 1.0), self.rng.gen_range(-1.0, 1.0))
        } else {
            // a random line passes through A and intersects the segment.
            Self::random_point_between(&pf, &pl, &mut self.rng)
        };
        // make sure the first point is to the left of the line.
        let line = if pf.to_left(&line_point, &pm) > 0 {
            (line_point, pm)
        } else {
            (pm, line_point)
        };

        let new_mid = self.split_points(first + 1, last - 1, mid, &line);
        if self.stepping {
            let left_points = self.collect_points(first + 1, new_mid - 1);
            let right_points = self.collect_points(new_mid + 1, last - 1);

            self.res.push_splitted(
                (pf, pl),
                pm,
                line,
                left_points.clone(),
                right_points.clone(),
            );
            self.partition(first, new_mid);

            self.res
                .push_splitted((pf, pl), pm, line, left_points, right_points);
            self.partition(new_mid, last);
        } else {
            self.partition(first, new_mid);
            self.partition(new_mid, last);
        }
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

        let new_b = self.split_points(1, self.n - 1, b, &(self.points[a], self.points[b]));
        self.partition(0, new_b);
        self.partition(new_b, self.n);

        self.idx.pop();
        if self.stepping {
            self.res.polygon = self.collect_points(0, self.n - 1);
        }
    }
}

pub fn generate(points: &[Point], rng: &mut impl Rng) -> Vec<usize> {
    let mut sp = SpacePartitionGenerator::new(points, rng, false);
    sp.generate();
    sp.idx
}

pub fn generate_stepping(
    points: &[Point],
    rng: &mut impl Rng,
) -> (Vec<usize>, SpacePartitionSteppingResult) {
    let mut sp = SpacePartitionGenerator::new(points, rng, true);
    sp.generate();
    (sp.idx, sp.res)
}
