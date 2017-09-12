;(function(){

var ws = window.socket = new WebSocket("ws://localhost");

ws.addEventListener("open", function(e){
	console.log("websocket connected");
});

ws.addEventListener("message", function(e){
	console.log("message", e);
	if (e.data === "reload"){

		window.location.reload();
	}
});

var is = window.is = {
	arr: function(value){
		return toString.call(value) === '[object Array]';
	},
	obj: function(value){
		return typeof value === "object" && !is.arr(value);
	},
	val: function(value){
		return ['boolean', 'number', 'string'].indexOf(typeof value) > -1;
	},
	str: function(value){
		return typeof value === "string";
	},
	num: function(value){
		return typeof value === "number";
	},
	bool: function(value){
		return typeof value === 'boolean';
	},
	fn: function(value){
		return typeof value === 'function';
	},
	sfn: function(value){
		return is.fn(value) && value.main;
	},
	def: function(value){
		return typeof value !== 'undefined';
	},
	undef: function(value){
		return typeof value === 'undefined';
	},
	simple: function(value){ // aka non-referential
		return typeof value !== 'object' && !is.fn(value); // null, NaN, or other non-referential values?

		// typeof null === "object"...
	},
	Class: function(value){
		return is.fn(value) && value.extend;
	},
	// better than "Class"
	Mod: function(value){
		return is.fn(value) && value.extend;
	},
	/// seems to work
	pojo: function(value){
		return is.obj(value) && value.constructor === Object;
	},
	mod: function(value){
		return is.obj(value) && is.Mod(value.constructor);
	},
	proto: function(value){
		return is.obj(value) && value.constructor && value.constructor.prototype === value;
	}
};

var assign = function(){
	var arg;
	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];
		for (var prop in arg){
			this[prop] = arg[prop];
		}
	}
	return this;
};

var Base = function(){
	this.instantiate.apply(this, arguments);
};

window.Base = Base;

Base.prototype.assign = assign;

Base.prototype.assign({
	instantiate: function(){}
});

Base.extend = function(){
	var Ext = function(){
		this.instantiate.apply(this, arguments);
	};
	Ext.assign = assign;
	Ext.assign(this);
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.prototype.assign.apply(Ext.prototype, arguments);

	return Ext;
};

var Base2 = window.Base2 = Base.extend();
Base2.extend = function(){
	var Ext = function Ext(){
		if (!(this instanceof Ext))
			return new (Ext.bind.apply(Ext, [null].concat([].slice.call(arguments))));
		this.instantiate.apply(this, arguments);
	};
	Ext.assign = this.assign;
	Ext.assign(this);
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.prototype.assign.apply(Ext.prototype, arguments);
	return Ext;
};

var app = window.app = {
	initialize: function(){
		this.modules = new Modules({
			app: this
		});
	},
	module: function(name, deps, fn){
		this.modules.define(name, deps, fn);
	}
};

var View = window.View = Base.extend({
	instantiate: function(){
		this.assign.apply(this, arguments);
		this.initialize();
	},
	initialize: function(){
		this.render();
		this.update();
	},
	render: function(){},
	update: function(){}
});


var Modules = Base.extend({
	instantiate: function(){
		this.modules = {};
	},
	get: function(name){
		// returns the Module object, not the module's exported (returned) value)
		return this.modules[name] ? this.modules[name] : this.make(name);
	},
	make: function(name, options){
		return this.modules[name] = new Module({
			name: name,
			app: this.app,
			modules: this
		}, options);
	},
	define: function(name, deps, fn){
		this.get(name).define(deps, fn);
	}
});

/*

app.module("main", [], function(){
	// should run immediately...
});

app.module("main", [])

*/

var Module = Base.extend({
	instantiate: function(){
		this.cbs = [];
		this.deps = [];

		// expecting { app, name }
		// { deps, fn } aren't known until module is loaded
		this.assign.apply(this, arguments);

		this.exec = this.exec.bind(this);
	},
	request: function(){
		this.script = document.createElement("script");
		this.script.src = "/" + this.name;
		document.head.appendChild(this.script);
	},
	dep: function(name){
		var dep = this.modules.get(name);
		dep.isDep = true;
		this.deps.push(dep);
		if (!dep.defined)
			dep.request();
	},
	define: function(deps, fn){
		// called via the app.module interface method
		this.fn = fn;
		// must wait for all deps before executing this module

		if (deps.length){
			for (var i = 0; i < deps.length; i++)
				this.dep(deps[i]);
			this.buildCompoundCB(this.deps, this.fn);
		} else {
			this.exec();
		}

		this.defined = true;
	},
	buildCompoundCB: function(){
		var addNextCB = this.exec;

		var wrapCB = function(dep, cb){
			return function(){
				dep.then(cb);
			};
		};

		for (var i = this.deps.length - 1; i > 0; i--){
			addNextCB = wrapCB(this.deps[i], addNextCB);
		}

		this.deps[0].then(addNextCB);
	},
	exec: function(){
		// exec 
		this.isLoaded = true;
		if (!this.isDep) console.group(this.name);
		this.value = this.fn.apply(null, this.args());
		if (!this.isDep) console.groupEnd();
		this.executed = true;
		this.execCBs();
		this.finished = true;
	},
	args: function(){
		var dep, args = [];
		for (var i = 0; i < this.deps.length; i++){
			dep = this.deps[i];
			if (dep.isLoaded)
				args.push(dep.value);
			else
				throw "whoops";
		}
		return args;
	},
	execCBs: function(){
		for (var i = 0; i < this.cbs.length; i++){
			this.cbs[i].call(null, this.value);
		}
	},
	then: function(cb){
		if (this.isLoaded){
			cb.call(null, this.value);
		} else {
			this.cbs.push(cb);
		}
	}
});



var el = function(tag){
	return document.createElement(tag || "div");
};


var addClass = function(el, cls){
	el.classList.add(cls);
	return el;
};

var appendDefault = function(el, value){
	el.append(value);
	return el;
};

var append = function(el, value){
	if (is.pojo(value)){
		return appendPojo(el, value);
	} else if (is.el(value)){
		return appendEl(el, value);
	} else {
		return appendDefault(el, value);
	}
};

var promoteRefs = function(frm, to){
	var refs;
	if (frm._refs){
		refs = to._refs = to._refs || {};
		for (var prop in frm._refs){
			if (!refs[prop]){
				refs[prop] = frm._refs[prop];
			}
		}
	}
};

var appendEl = function(el, child){
	promoteRefs(child, el);
	el.appendChild(child);
	return el;
};

var appendPojo = function(ele, pojo){
	if (ele._refs){
		console.info("already has refs");
	} else {
		ele._refs = {};
	}

	var child, value;

	for (var prop in pojo){
		value = pojo[prop];
		if (is.el(value)){
			// use value as child
			child = addClass(value, prop);
		} else {
			// make new child and append value
			child = append(addClass(el(), prop), value);
		}

		// append and reference
		ele._refs[prop] = appendEl(ele, child);
	}

	return ele;
};

is.el = function(value){
	return value && value.nodeType === 1;
};

var tpl = window.tpl = function(token, children){
	var element;
	if (is.str(token)){
		token = token.split(".");
		if (token[0] === ""){
			// token starts with a .class
			element = el();
			// remove empty string
			token = token.slice(1);
		} else {
			// token starts with a tag
			element = el(token[0]);
			// remove tag
			token = token.slice(1);
		}

		for (var j = 0; j < token.length; j++){
			addClass(element, token[j]);
		}

		children = [].slice.call(arguments, 1);
	} else {
		element = el();
		children = arguments;
	}

	for (var i = 0; i < children.length; i++){
		append(element, children[i]);
	}

	return element;
};

View.prototype.tpl = function(token, children){
	var ele = tpl.apply(null, arguments);
	if (ele._refs){
		for (var i in ele._refs){
			if (!this[i])
				this[i] = ele._refs[i];
			else
				console.warn("collision at", i);
		}
	}
	this.el = ele;
	return this;
};




app.initialize();

app.Base = Base;
app.is = is;


})();