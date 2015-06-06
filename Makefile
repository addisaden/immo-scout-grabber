default: main

main: main.js lib/*.js
	browserify main.js > main_compiled.js
	node js_to_html.js
