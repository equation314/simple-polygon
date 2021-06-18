# simple-polygon

Simple polygon generator and find the shortest paths inside a simple polygon.

## Build the CLI tool

```
make build_cli
```

The executable will built at `target/release/simple-polygon-cli`.

### Generate a random simple polygon

```
simple-polygon-cli gen [OPTIONS] -n <N>

OPTIONS:
    -n <N>                    Number of vertices
    -a, --algo <ALGORITHM>    The algorithm of the generator [default: 2opt]  [possible values: growth, space, 2opt,
                              permute]
    -o, --output <FILE>       The output polygon file
    -r, --range <R>           The coordinate range [0, R) of the generated polygon [default: 1000]
```

### Triangulate a simple polygon

```
simple-polygon-cli tri [OPTIONS] <IN_FILE>

OPTIONS:
    -a, --algo <ALGORITHM>    The triangulation algorithm [default: mono_partition]  [possible values: ear_cutting,
                              mono_partition]
    -o, --output <OUT_FILE>    Output diagonals to the file

ARGS:
    <IN_FILE>    The input polygon file
```

### Find the shortest path

```
simple-polygon-cli sp [OPTIONS] <FILE> --start <x> <y> --end <x> <y>

OPTIONS:
    -s, --start <x> <y>       The start point
    -e, --end <x> <y>         The end point
    -a, --algo <ALGORITHM>    The triangulation algorithm [default: mono_partition]  [possible values: ear_cutting,
                              mono_partition]

ARGS:
    <FILE>    The input polygon file
```

## Build the Web app

For the first time, run the following commands to install dependencies:

```
cargo install wasm-pack
cd web/site
npm install
```

After that, run the following command to build the website:

```
make build_web
```

You can also run the following command to start a Web server at http://localhost:8080.

```
make serve
```
