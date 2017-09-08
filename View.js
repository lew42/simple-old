app.module("View", [], function(){

var View = Base.extend({
	instantiate: function(){
		this.assign.apply(this, arguments);
		this.initialize();
	},
	initialize: function(){
		var args = this.args.apply(this, arguments);
		this.render_el();
			this.getCaptured();
		this.pre_render();
		this.render.apply(this, args);
			this.restoreCaptor();
	},
	args: function(token){
		if (is.str(token) && !/\s/.test(token)){
			// first arg is string with no whitespace
			
			// if (token[0] === "."){}

			if (!this.tag){
				// token might start with a valid element

			}
		}
	},
	render_el: function(){
		this.tag = this.tag || "div";
		this.el = document.createElement(this.tag);

		if (this.name)
			this.addClass(this.name);

		if (this.classes)
			this.addClass.apply(this, this.classes.split(" "));
	},
	addClass: function(){
		for (var i = 0; i < arguments.length; i++){
			this.el.classList.add(arguments[i]);
		}
		return this;
	},
	render: function(){
		this.append.apply(this, arguments);
	},
	getCaptured: function(){
		if (View.captor){
			View.captor.append(this);
		}
	},
	becomeCaptor: function(){
		View.previousCaptor = View.captor;
		View.captor = this;
	},
	post_render: function(){
		this.restoreCaptor();
	},
	restoreCaptor: function(){
		View.captor = View.previousCaptor;
	}
}).assign({
	// extend: function(){
	// 	var Ext = Base.extend.apply(this, arguments);
	// 	Ext.extend_View();
	// 	return Ext;
	// }
});

View.V = View.extend({
	instantiate: function(){
		this.initialize.apply(this, arguments);
	}
});

var validElements = ["div", "p", "span", "h1"];

var tokens = [
	{
		token: "span",
		tag: "span",
		classes: ""
	},
	{
		token: "hello",
		tag: "",
		classes: ""
	},
	{
		token: "p.yo",
		tag: "p",
		classes: "yo"
	},
	{
		token: "p.yo.mo",
		tag: "p",
		classes: "yo mo"
	},
	{
		token: ".one.two",
		classes: "one two"
	}
];

var tokenToProps = function(token){
	var result = {};
	token = token.split(".");
	if (token[0] === ""){
		return {
			classes: token.slice(1).join(" ")
		};
	} else if (validElements.indexOf(token[0]) > -1){
		// token starts with an element
		return {
			tag: token[0],
			classes: token.slice(1).join(" ")
		};
	} else {
		return {
			tag: "",
			classes: ""
		}
	}
};

var res;
for (var i = 0; i < tokens.length; i++){
	console.group(tokens[i])
	res = tokenToProps(tokens[i].token);
	console.assert(tokens[i].tag === res.tag);
	console.assert(tokens[i].classes === res.classes);
	console.groupEnd();
}

return View;

});