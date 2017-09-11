app.module("root", ["View"], function(View){

	var p = View.extend({
		tag: "p",
		classes: "super duper",
		_auto_append: true
	});

	var v = View().addClass("app").append(function(){
		p().append("hello world");
		p("hello world");
	});

	document.body.appendChild(v.el);

	v.append(p().append("hello world"));
	v.append(p("hello world"));
});