.PHONY: test

REPORTER = nyan

install:
	@which mocha 2>/dev/null || @npm install

test: install
	@NODE_ENV=test mocha ./server/test \
		--reporter $(REPORTER) \
		--growl \
		--watch \
		--spec
