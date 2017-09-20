define("index.js", ["something", "another"], function(something, another){
	console.log("this is index.js", something, another);
	console.log(document.currentScript);
});