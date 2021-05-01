.PHONY: build clean

env:
	cargo install wasm-pack

build:
	wasm-pack build web/

build_web: build
	npm run build -C web/site

serve: build
	npm run serve -C web/site

clean:
	cargo clean
	rm -rf web/pkg/ web/site/dist/
