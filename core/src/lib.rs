pub mod gen;
pub mod geo;
pub mod shortest;
pub mod tri;

pub fn hello() -> usize {
    println!("Hello World!");
    2333
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
