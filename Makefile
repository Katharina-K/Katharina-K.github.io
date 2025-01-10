all: website

website: index.html js/byp.ts
	tsc -target es6 js/byp.ts js/wiki_game.ts js/progressBar.ts js/drumroll.ts --outFile js/byp.js
	

work: index.html js/byp.ts
	npm start &
	tsc -watch -target es6 js/byp.ts js/wiki_game.ts js/progressBar.ts js/drumroll.ts --outFile js/byp.js

.phony: all work test
