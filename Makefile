.PHONY: build clean

env:
	cargo install wasm-pack

build:
	wasm-pack build

clean:
	cargo clean
	rm -rf pkg
