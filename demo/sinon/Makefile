REPORTER = dot
CompHome=/Users/angl

all: build
	
build:
	${CompHome}/node_modules/coffee-script/bin/coffee \
        -c \
        -o lib src

clean:
	rm -rf lib
	mkdir lib

watch:
	${CompHome}/node_modules/coffee-script/bin/coffee \
        -o lib \
        -cw src

test:
	${CompHome}/node_modules/mocha/bin/mocha \
        --reporter $(REPORTER) \
        --compilers coffee:coffee-script/register \
        ./test/*.test.coffee

.PHONY: build clean watch test