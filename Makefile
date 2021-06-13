.PHONY: build clean

MODE ?= release

build_args :=
ifeq ($(MODE), release)
build_args += --release
endif

all: build_cli build_wasm

env:
	cargo install wasm-pack

build_cli:
	cargo build $(build_args)

build_wasm:
	wasm-pack build web/

build_web: build_wasm
	npm run build -C web/site

serve: build_wasm
	npm run serve -C web/site

gen:
	cargo run $(build_args) -- gen -n 10 -o gen.txt

sp:
	cargo run $(build_args) -- sp testcases/polygon/00.pts -s 91 104 -e 119 119

test:
	cargo test $(build_args) -- --nocapture

clean:
	cargo clean
	rm -rf web/pkg/ web/site/dist/
