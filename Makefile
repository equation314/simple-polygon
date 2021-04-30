.PHONY: build clean

build:
	wasm-pack build

clean:
	cargo clean
	rm -rf pkg
