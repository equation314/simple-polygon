use serde::Serialize;
use std::collections::VecDeque;

use crate::geo::{Point, Polygon};
use crate::tri::{Algorithm, Triangulation};

#[derive(Serialize, Debug)]
pub struct ShortestPathStep {
    pub cusp: Point,
    pub current: Point,
    pub tangent: Option<Point>,
    pub left_chain: Vec<Point>,
    pub right_chain: Vec<Point>,
    pub path: Vec<Point>,
}

#[derive(Serialize, Debug)]
pub struct ShortestPathSteppingResult {
    pub sleeve_diagonals: Vec<(Point, Point)>,
    pub sleeve_boundary: Vec<(Point, Point)>,
    pub steps: Vec<ShortestPathStep>,
}

fn find_shortest_path_in_sleeve_stepping(
    poly: &Polygon,
    start: Point,
    end: Point,
    diagonals: &[(usize, usize)],
) -> Vec<ShortestPathStep> {
    let mut path = vec![start];
    let mut result = vec![ShortestPathStep {
        cusp: start,
        current: end,
        tangent: None,
        path: vec![],
        left_chain: vec![],
        right_chain: vec![],
    }];
    if diagonals.is_empty() {
        path.push(end);
        result.push(ShortestPathStep {
            cusp: start,
            current: end,
            tangent: None,
            path,
            left_chain: vec![],
            right_chain: vec![],
        });
        return result;
    }

    let mut cusp = start;
    let (mut prev_u, mut prev_v) = diagonals[0]; // the previous diagonal.
    let mut chain_l = VecDeque::from(vec![cusp]); // the left inward-convex chain.
    let mut chain_r = VecDeque::from(vec![cusp]); // the right inward-convex chain.
    let mut current = start;
    if poly.points[prev_u] != start {
        current = poly.points[prev_u];
        chain_l.push_back(current);
    }
    if poly.points[prev_v] != start {
        current = poly.points[prev_v];
        chain_r.push_back(current);
    }
    result.push(ShortestPathStep {
        cusp,
        current,
        tangent: None,
        path: vec![],
        left_chain: chain_l.clone().into(),
        right_chain: chain_r.clone().into(),
    });

    for &(u, v) in &diagonals[1..] {
        let saved_chain_l: Vec<Point> = chain_l.clone().into();
        let saved_chain_r: Vec<Point> = chain_r.clone().into();
        let saved_path = path.clone();
        let saved_cusp = cusp;

        let (idx, cl, cr, rev) = if u != prev_u {
            (u, &mut chain_r, &mut chain_l, true)
        } else if v != prev_v {
            (v, &mut chain_l, &mut chain_r, false)
        } else {
            unreachable!()
        };

        let to_left = |a: &Point, b: &Point, c: &Point| -> isize {
            let t = c.to_left(a, b);
            if rev {
                -t
            } else {
                t
            }
        };

        let current = poly.points[idx];
        let tangent_point = if cr.len() == 1 || to_left(&cusp, &cr[1], &current) >= 0 {
            // find the tangent of right chain and split the funnel.
            while cr.len() > 1 && to_left(&cr[cr.len() - 2], &cr[cr.len() - 1], &current) < 0 {
                cr.pop_back();
            }
            cr.push_back(current);
            cr[cr.len() - 2]
        } else if cl.len() > 1 && to_left(&cusp, &cl[1], &current) <= 0 {
            // find the tangent of left chain and split the funnel.
            while cl.len() > 1 && to_left(&cl[0], &cl[1], &current) < 0 {
                cl.pop_front();
                path.push(cl[0]);
            }
            cusp = cl[0]; // new cusp
            *cr = VecDeque::from(vec![cl[0], current]);
            cusp
        } else {
            // the cusp is the tangent point.
            *cr = VecDeque::from(vec![cr[0], current]);
            cusp
        };

        prev_u = u;
        prev_v = v;
        result.push(ShortestPathStep {
            cusp: saved_cusp,
            current,
            tangent: None,
            path: saved_path.clone(),
            left_chain: saved_chain_l.clone(),
            right_chain: saved_chain_r.clone(),
        });
        result.push(ShortestPathStep {
            cusp: saved_cusp,
            current,
            tangent: Some(tangent_point),
            path: saved_path.clone(),
            left_chain: saved_chain_l,
            right_chain: saved_chain_r,
        });
        result.push(ShortestPathStep {
            cusp,
            current,
            tangent: None,
            path: path.clone(),
            left_chain: chain_l.clone().into(),
            right_chain: chain_r.clone().into(),
        });
    }

    // deal with the end point.
    let saved_path = path.clone();
    let (cl, cr) = (&chain_l, &chain_r);
    if cl.len() > 1 && cr.len() > 1 {
        let mut i = 0;
        while i < cl.len() - 1 && end.to_left(&cl[i], &cl[i + 1]) <= 0 {
            path.push(cl[i + 1]);
            i += 1;
        }
        let mut i = 0;
        while i < cr.len() - 1 && end.to_left(&cr[i], &cr[i + 1]) >= 0 {
            path.push(cr[i + 1]);
            i += 1;
        }
    }

    path.push(end);
    result.push(ShortestPathStep {
        cusp,
        current: end,
        tangent: None,
        path: saved_path.clone(),
        left_chain: chain_l.clone().into(),
        right_chain: chain_r.clone().into(),
    });
    result.push(ShortestPathStep {
        cusp,
        current: end,
        tangent: Some(path[path.len() - 2]),
        path: saved_path,
        left_chain: chain_l.into(),
        right_chain: chain_r.into(),
    });
    result.push(ShortestPathStep {
        cusp: start,
        current: end,
        tangent: None,
        path,
        left_chain: vec![],
        right_chain: vec![],
    });
    result
}

pub fn find_shortest_path_stepping(
    poly: &Polygon,
    start: Point,
    end: Point,
    triangulation_algo: Algorithm,
) -> Option<ShortestPathSteppingResult> {
    let tri = Triangulation::build(poly, triangulation_algo);
    let dual = tri.result().plane_graph.build_dual_graph();

    if let (Some(s), Some(e)) = (tri.location(&start), tri.location(&end)) {
        // find a path in the dual graph (tree).
        if let Some(path) = dual.find_path(s.id, e.id) {
            let diagonals = path
                .iter()
                .map(|e| (e.weight.borrow().start, e.weight.borrow().end));
            let sleeve_diagonals = diagonals
                .clone()
                .map(|(s, e)| (poly.points[s], poly.points[e]))
                .collect::<Vec<_>>();
            let diagonals = diagonals.collect::<Vec<_>>();

            let mut sleeve_boundary = vec![];
            if !diagonals.is_empty() {
                let (u1, v1) = diagonals[0];
                let (u2, v2) = *diagonals.last().unwrap();
                sleeve_boundary = vec![
                    (start, poly.points[u1]),
                    (start, poly.points[v1]),
                    (end, poly.points[u2]),
                    (end, poly.points[v2]),
                ];
                for (i, &(u, v)) in diagonals[1..].iter().enumerate() {
                    let (prev_u, prev_v) = diagonals[i];
                    if u == prev_u {
                        sleeve_boundary.push((poly.points[v], poly.points[prev_v]));
                    } else {
                        sleeve_boundary.push((poly.points[u], poly.points[prev_u]));
                    }
                }
            }

            // find the shortest path in the sleeve polygon.
            let steps = find_shortest_path_in_sleeve_stepping(poly, start, end, &diagonals);
            return Some(ShortestPathSteppingResult {
                sleeve_boundary,
                sleeve_diagonals,
                steps,
            });
        }
    }
    None
}
