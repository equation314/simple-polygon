.PHONY: build clean

env:
	cargo install wasm-pack

build:
	wasm-pack build web/

build_web: build
	npm run build -C web/site

serve: build
	npm run serve -C web/site

gen:
	cargo run -- gen -n 10 -o gen.txt

sp:
	cargo run -- sp gen.txt -s 91 104 -e 119 119

test:
	cargo test -- --nocapture

clean:
	cargo clean
	rm -rf web/pkg/ web/site/dist/
