use crate::geo::Polygon;

pub fn gen_polygon(n: usize, algo: &str) -> Polygon {
    println!("N: {}, algo: {}", n, algo);
    Polygon::from_slice(&[
        [104, 129],
        [76, 118],
        [90, 100],
        [95, 110],
        [92, 99],
        [100, 100],
        [101, 108],
        [107, 90],
        [109, 109],
        [128, 113],
    ])
}
