/*


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




OPTIONAL el.class Token
* Leave .tag undefined
* When rendering, this.tag || "div";
* Only scan for El token if !this.tag;
* For a P class, tag is set to "p", so we ignore any el.class tokens, but still look for .cl.ass tokens.

Otherwise,
OPTIONAL .class TOKEN
* Starts with "."



View.mixin.quickie
* don't assign anything
* need to render w/ .tag and .classes


var el = View.El;
var p = View.El.extend({ tag: "p" })
View.el = function(tag){
	return this.extend({ tag: tag }, ...arguments);
};

var p = View.el("p"); // might be confusing with El...

var v = View;
var el = View.El;

v("hello", el("span", "world"));

var span = el.extend("span");

v("hello", span("world"));


Do we need View and El?
The big difference is the treatment of the POJOs...

You could wrap them:

v( [ {} ] )
// wrap children in an array...?




Maybe, then, we name it something other than "El"?
* It's not a dom element

View().append({}) might be just as good, very explicit.

It is kind of nice to be able to use:

v({
	header: {
		icon: icon("beer"),
		title: this.prop("name"),
		btn: btn("arrow").click(this.activate)
	},
	body: [
		p("Yo"),
		ul(".something",
			li("one"),
			li("two"),
			li("three")
		),
		ul(function(){
			li("one");
			li("two");
			li("three");
		})
	],
	footer: {
		"col.col2-3"
	}
});



Reusable template vs instance:

View.extend(p("yo"), ul(li("one"), li("two")));
--> must track and clone all children, and recreate the entire process...


View.extend({
	render: function(){
		this.append({
			...
		});
	}
});

btn("arrow")
If the main View can do the token, and appending, with the exception of pojos (that get assigned...)

Maybe, if you need to assign stuff, you
a) do it afterwards:
v({append}).assign({props});

b) make a class:
v.extend({... always assigned});









If View.El is re-extended...
1) Are those adjustments accessible?

Could/should they be mixins?


View.el() --> creates instance
View.El() --> creates class?

var p = View.El.extend({ tag: "p" });

vs 

var p = View.p || View.P;

So you can use View.P("Yo"), or break it out:

var p = View.P;

p("Yo");



How about a generic el?

View.El("span.yo")






*/







View.El = function(token, assignments){
	// 1. parse token to tag/classes
	// 2. create { tag, classes } first arg
	// 2b.  set .args() handler to .append_special() 
	// 3. var Element = this.extend(first, ...arguments);
};

View.el = function(token, viewables){
	// 1. parse token for tag/classes
	// 2. create first arg with {tag, classes, args --> append_special}
};


View.extend = function(){
	var Ext = Base.extend.apply(this, arguments);
		// note, this doesn't work for re-extending...

	Ext.extend_View();
};

View.extend_View = function(){
	this.el = this.el.bind(this);
	// create all elements?

	// With an .extend hook, we can auto-extend all the others?
	// that way, View.El could be extended, rather than a helper function

	this.El = this.extend({});
};


View.prototype.args = View.prototype.assign;

View.El = View.extend({
	args: View.prototype.args_token
});

View.El("mandatory.token", viewables);
View.p = View.El.extend({ tag: "p" });

View.prototype.args_special = function(optionalToken, viewables){
	// token can't just be an element
	// token might only be .class.es, and must start with "."
	// 
};

View.prototype.args_token = function(token, viewables){
	// mandatory token: el, el.class.es, || .class.es and defaults to div
};

/*
Rather than have this... mandatory vs optional token thingy...

We could do a lookup against approved elements.
1. First arg is string
2. First arg has no whitespace
3. First arg begins with "."
	or
	** We could use a hasOwn ".tag" check**
		If the element has been manually given a tag, don't allow switching the tag?
		That would enable you to still say those things, like div("span") or even span("span") would already be locked into a tag, and so they would skip treating that as a token...

		You'd actually need to check prototype.hasOwn, because.. yea.

		Or, you could default to leaving .tag undefined until you actually render the element.

	First arg begins with ["valid", "element", "lookup"]

then treat as token

Otherwise, append it...

Now, we're restricted from creating quick elements that append content like "span", or 



Can View("hello world"), then also append?
* can't just assign all, but have to do some switching
* could make things a little simpler..?

It makes things a little confusing.  Do I use View or div?


When do we render the element?

instantiate()
	args()
	initialize()
		prerender()
			get_captured (if there's an active captor)
				append to parent immediately
				shouldn't matter for out-of-DOM rendering
				and when its synchronous/live rendering, you'll probably want this to happen first.
			become_captor?
		render_el()
		render()
		postrender()


If we want to auto-append, we need to render_el(), then append all (handle args after rendering the .el)

If we want to allow configuring the View before anything happens, we need to:
- assign all args BEFORE anything else.

In order to start appending, you need to render.




View("apppend strings", { assign obj }, function(){}, function(){}, "multiple render fns?" );

If we want the above syntax to work, it gets tricky - you basically have to queue up all the things to append.
-> You can't append until you have the .el
-> You need to wait until the end in order to render?

Or, you could pluck the tag/token/classes info (everything needed to render the .el), and start appending immediately.

Then assign objects, and append the rest.




Hmm, assuming I could do that...
* Implement the optional token with element lookup into the main View class:

View("span", "yo");
View("span.whatever", ...);

View.El("mandatory.token", <viewables>).assign({})

View.el("mandatory.token?")
	With the... element lookup method, it could still be optional:

el("yo") --> div>yo
el("yo.u") --> div>yo.u
el("span") --> span
el("span", "span") --> span>span
el("div.yo") --> div.yo
el(".yo", "u") --> div.yo>u

el.extend({ tag || token || classes || anything });

View.p = View.el.extend({ tag: "p" });

// lowercase means: shorthand
* first arg element matching if .tag is undefined
* append all

*/