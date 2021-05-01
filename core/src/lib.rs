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
