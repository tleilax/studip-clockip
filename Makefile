build: css js

css:
	recess --compile clock.less > clock.css

js:
	coffee --compile --print --bare clock.coffee > clock.js

