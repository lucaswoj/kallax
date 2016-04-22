TSX_FILES = $(shell find code -type f -name '*.tsx')
JS_FILES = $(patsubst code/%.tsx, artifacts/code/%.js, $(TSX_FILES))

.PHONY: all
all: node_modules artifacts/code/index.html $(JS_FILES)

.PHONY: clean
clean:
	rm -rf artifacts

typings: typings.json
	typings install

artifacts/code/%.js: code/%.tsx typings Makefile
	@mkdir -p "$(@D)"
	tslint $<
	tsc \
		--jsx react \
		--outDir $(@D) \
		$< \
		typings/main.d.ts

artifacts/code/index.html: code/index.html
	@mkdir -p "$(@D)"
	cp $< $@

node_modules: package.json
	npm install
