
TEXSOURCE = main.tex
all: build/$(TEXTARGET) $(PYTARGET)

TEXOPTIONS = -lualatex \
		--output-directory=build \
		--interaction=nonstopmode \
		--halt-on-error \
		--use-make \

TEXPREFIX = TEXINPUTS=build: \
	BIBINPUTS=build: \
	max_print_line=1048576 \

clean:
	rm -rf build

build:
	mkdir -p build

# Use this to work on tex-document, it will be updated continuesly by latexmk
work:
	$(TEXPREFIX) latexmk -pvc $(TEXOPTIONS) $(TEXSOURCE)

build/$(TEXTARGET): $(TEXSOURCE) $(TEXDEPEND) $(PYTARGET) FORCE | build
	$(TEXPREFIX) latexmk $(TEXOPTIONS) $(TEXSOURCE)

FORCE:

.PHONY: all clean FORCE build
