use std::collections::VecDeque;

use crate::geo::{Point, Polygon};
use crate::tri::{Algorithm, Triangulation};

fn find_shortest_path_in_sleeve(
    poly: &Polygon,
    start: Point,
    end: Point,
    diagonals: &[(usize, usize)],
) -> Vec<usize> {
    let mut path = Vec::new();
    if diagonals.is_empty() {
        return path;
    }

    let n = poly.size();
    let mut points = poly.points.clone();
    points.push(start);

    let mut cusp_idx = n;
    let (mut prev_u, mut prev_v) = diagonals[0];
    let mut chain_l = VecDeque::from(vec![cusp_idx]);
    let mut chain_r = VecDeque::from(vec![cusp_idx]);
    if points[prev_u] != start {
        chain_l.push_back(prev_u);
    }
    if points[prev_v] != start {
        chain_r.push_back(prev_v);
    }

    for &(u, v) in &diagonals[1..] {
        let (idx, cl, cr, rev) = if u != prev_u {
            (u, &mut chain_r, &mut chain_l, true)
        } else if v != prev_v {
            (v, &mut chain_l, &mut chain_r, false)
        } else {
            unreachable!()
        };

        let to_left = |a: usize, b: usize, c: usize| -> isize {
            let t = points[c].to_left(points[a], points[b]);
            if rev {
                -t
            } else {
                t
            }
        };

        if cr.len() == 1 || to_left(cusp_idx, cr[1], idx) >= 0 {
            // find the tangent of right chain and split the funnel.
            while cr.len() > 1 && to_left(cr[cr.len() - 2], cr[cr.len() - 1], idx) < 0 {
                cr.pop_back();
            }
            cr.push_back(idx);
        } else if cl.len() > 1 && to_left(cusp_idx, cl[1], idx) <= 0 {
            // find the tangent of left chain and split the funnel.
            while cl.len() > 1 && to_left(cl[0], cl[1], idx) < 0 {
                cl.pop_front();
                path.push(cl[0]);
            }
            cusp_idx = cl[0];
            *cr = VecDeque::from(vec![cl[0], idx]);
        } else {
            // the cusp is the tangent point.
            *cr = VecDeque::from(vec![cr[0], idx]);
        }

        prev_u = u;
        prev_v = v;
    }

    // deal with the end point.
    let (cl, cr) = (&mut chain_l, &mut chain_r);
    if cl.len() > 1 && cr.len() > 1 {
        let mut i = 0;
        while i < cl.len() - 1 && end.to_left(points[cl[i]], points[cl[i + 1]]) <= 0 {
            path.push(cl[i + 1]);
            i += 1;
        }
        let mut i = 0;
        while i < cr.len() - 1 && end.to_left(points[cr[i]], points[cr[i + 1]]) >= 0 {
            path.push(cr[i + 1]);
            i += 1;
        }
    }

    path
}

pub fn find_shortest_path(poly: &Polygon, start: Point, end: Point) -> Option<Vec<usize>> {
    let mut tri = Triangulation::build(poly, Algorithm::EarCutting);
    tri.build_dual_graph();

    if let (Some(s), Some(e)) = (tri.location(start), tri.location(end)) {
        let path = tri.dual().find_path(s.id, e.id);
        let diagonals = path
            .iter()
            .map(|e| (e.weight.borrow().start, e.weight.borrow().end))
            .collect::<Vec<_>>();
        Some(find_shortest_path_in_sleeve(poly, start, end, &diagonals))
    } else {
        None
    }
}
