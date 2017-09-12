app.module("index.js", ["View.js", "Test.js", "CSS.js"], function(View, Test, CSS){

	var styles = new CSS();
	styles.select("body", "background: blue;");
	styles.inject();

	console.log("this is index.js");
	var p = View.extend({
		tag: "p",
		classes: "super duper",
		_auto_append: true
	});

	var v = View().addClass("app").append(function(){
		p().append("hello world");
		p("hello worldz2s4aab");

		test("this is just a test", function(){
			console.log("woooohoooo wezeee");
		});
		test("another test", function(){
			console.log("woooohoooo weeee");
			assert("okzz");
			assert("ok" === "not ok");
		});
	});

	document.body.appendChild(v.el);

	v.append(p().append("hello world"));
	v.append(p("hello world"));
});