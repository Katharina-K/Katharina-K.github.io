all: build/bg.pdf | build

.phony: build clean

build: 
	mkdir -p build

build/bg.pdf: bg.tex | build
	TEXINPUTS=:build: \
	BIBINPUTS=:build: \
	max_print_line=1048576 \
	latexmk \
	-pdf \
		--output-directory=build \
		--interaction=nonstopmode \
		--halt-on-error \
		bg.tex
	pdf2svg build/bg.pdf build/bg.svg
	cat build/bg.svg | \
	sed "s/viewBox=\"[0-9,.]* [0-9,.]* [0-9,.]* /viewBox=\"100 0 1000 /" \
	> build/bg_crop.svg


work:
	TEXINPUTS=build: \
	BIBINPUTS=build: \
	max_print_line=1048576 \
	latexmk -pvc \
			-synctex=1 \
			-lualatex \
			--output-directory=build \
			--interaction=nonstopmode \
			--halt-on-error \
			bg.tex

clean:
	rm -rf build/