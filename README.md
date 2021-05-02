# simple-polygon

Simple polygon generator and find the shortest paths inside a simple polygon.

## Generate a random simple polygon

```
cargo run -- gen [OPTIONS] -n <N>

OPTIONS:
    -n <N>                    Number of vertices
    -a, --algo <ALGORITHM>    The algorithm of generator [default: 2opt]  [possible values: growth, space, 2opt]
    -o, --output <FILE>       The output polygon file
```

## Find the shortest path

```
cargo run -- sp <FILE> --start <x> <y> --end <x> <y>

OPTIONS:
    -s, --start <x> <y>    The start point
    -e, --end <x> <y>      The end point

ARGS:
    <FILE>    The input polygon file
```

## Build the Web app

```
cargo install wasm-pack
make build_web
```
