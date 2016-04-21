TSX_FILES = $(shell find code -type f -name '*.tsx')
JS_FILES = $(patsubst code/%.tsx, artifacts/code/%.js, $(TSX_FILES))
.PHONY: all
all: node_modules artifacts/code/index.html $(JS_FILES)

clean:
	rm -rf artifacts

typings: typings.json
	typings install

artifacts/code/%.js: code/%.tsx typings
	@mkdir -p "$(@D)"
	tsc \
		--outDir artifacts/code \
		typings/main.d.ts \
		$<

artifacts/code/index.html: code/index.html
	@mkdir -p "$(@D)"
	cp $< $@

node_modules: package.json
	npm install
