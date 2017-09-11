app.module("index.js", ["View.js", "Test.js"], function(View){

	console.log("this is index.js");
	var p = View.extend({
		tag: "p",
		classes: "super duper",
		_auto_append: true
	});

	var v = View().addClass("app").append(function(){
		p().append("hello world");
		p("hello world");

		test("this is just a test", function(){
			console.log("woooohoooo weeee");
		});
	});

	document.body.appendChild(v.el);

	v.append(p().append("hello world"));
	v.append(p("hello world"));
});