/*
 * window.define
 */

console.log(document.currentScript);

;(function(){
	
var Base = function(){
	this.instantiate.apply(this, arguments);
};

Base.assign = function(){
	var arg;
	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];
		for (var prop in arg){
			this[prop] = arg[prop];
		}
	}
	return this;
};

Base.prototype.assign = Base.assign;
Base.prototype.instantiate = function(){
	// this.assign.apply(this, arguments);
	// this.initialize();
};
// Base.prototype.initialize = function(){};

Base.extend = function(){
	var Ext = function(){
		this.instantiate.apply(this, arguments);
	};
	Ext.assign = this.assign;
	Ext.assign(this);
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.prototype.assign.apply(Ext.prototype, arguments);

	return Ext;
};


var modules = {};

var getModule = function(id){
	// resolve paths and ids?
	return (modules[id] = modules[id] || new Module()); 
};

var paths = {
	clean: function(parts){
		if (parts[0] === "")
			parts = parts.slice(1);

		if (parts[parts.length - 1] === "")
			parts = parts.slice(0, -1);

		return parts;
	},
	// converts "/one/two/", "one/two", "/one/two" and "one/two/" all to ["one", "two"]
	parts: function(path){
		return this.clean(path.split("/"));
	}
};

var Module = Base.extend({
	modules: {}, // intentionally shared between all modules
	instantiate: function(){
		this.assign.apply(this, arguments);

		this.parts = []; // ["abs", "path"]
		this.dep_ids = []; // array of dep ids (strings)
		this.deps = []; // dependencies (Module instances)
		this.dependents = [];
	},
	sub: function(){},
	define: function(){
		var arg;

		// we need to parse this script's src, if not pre-registered
		// we need to do this before defining deps
		this.register_orphan();

		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (is.arr(arg)){
				arg.forEach(this.require.bind(this));
				// this.require.apply(this, arg);
			} else if (is.obj(arg)){
				this.define_obj(arg);
			} else if (is.fn(arg)){
				this.factory = arg;
			}
		}

		if (!this.deps.length)
			this.exec();

		this.defined = true;
	},
	register_orphan: function(){
		if (!this.registered){
			// this only runs if not preregistered, aka an orphan?
			var script = document.currentScript;
			var a = document.createElement("a");
			a.href = script.src;

			var path = a.pathname;

			console.group("register_orphan", path);
			this.parts = path.split("/");
			console.log("parts", this.parts);
			this.file = this.parts[this.parts.length - 1];
			console.log("file", this.file);
			this.parts.pop();
			console.log("parts", this.parts);
			console.groupEnd();

			this.registered = true;
		}
	},
	register: function(){
		// may have been preregistered, in which case we can skip this 
		if (!this.registered){
			// if not pre registered, 


			this.registered = true;
		}
	},
	resolve: function(token){
		if (token[0] === "."){
			return this.resolve_relative(token);
		} else if (token[0] === "/"){
			return this.resolve_absolute(token);
		} else {
			return this.resolve_module(token);
		}

		// id: path + file.ext
		// parts
		// file
		// if module exists, use that one
		// if not, create a new one, 
	},
	resolve_relative: function(){
		// use anchor tag, just make sure to start href with "/"
	},
	resolve_module: function(token){
		// this.settings.modules + "/"
		var src = "/modules/" + token;
		var module = this.modules[id];

		if (!module) {
			module = new Module();
			// we need parts to recompute relative paths?
			// or, can we use anchor tags? nope - gotta parse the paths
			module.set_src(src);
			this.modules[id] = module;
		}

		return module;
	},
	// set_src: function(src){
	// 	if (src[src.length - 4] !== "."){
	// 		this.src = src + ".js";
	// 	} else {
	// 		this.src = src;
	// 	}
	// },
	// load: function(parent, token){
	// 	var id = this.resolve(parent, token);
	// },
	require: function(token){
		// resolve token based on this.path
		var id = "/modules/" + token + ".js",
			module;
		if (this.modules[id]){
			module = this.modules[id];
		} else {
			module = new Module({
				id: id,
				parent: this,
				token: token
			});
			module.request();
		}

		// used to generate the .factory args
		this.deps.push(module);

		// used to notify dependents when its ready
		module.dependents.push(this);
	},
	define_obj: function(obj){
		console.error("todo");
	},
	// only called on dependencies the first time they're required?
	// this is basically "initialize", but so is "define"..?
	register: function(id, parent){
		this.register_path(id, parent);
		if (parent)
			this.dependents.push(parent);
	},
	register_path: function(id, parent){
		if (dep[0] === "."){
			// relative
			if (dep[1] === "/"){
				// "./"

			} else if (dep[1] === "." && dep[2] === "/"){
				// "../"
			}
		} else if (dep[0] === "/"){
			// absolute
		} else {
			// module
		}

	},
	src: function(){
		if (!this.file)
			console.warn("this module doesn't have a .file name!");

		return this.path() + this.file;
	},
	path: function(){
		if (this.parts.length){
			return "/" + this.parts.join("/") + "/";
		} else {
			return "/";
		}
	},
	register: function(parent){
		if (!this.registered){

			// this is called from .require(parent) and .define(), with and without a parent
				// but, it should only be registered once
				// it may have been registered before defined
					// in this case, we have a parent
				// it may be defined without being registered
					// in this case, we have no parent

			if (parent){
				// used to notify dependents that we've finished
				this.dependents.push(parent);
			}

			// register path
				// if parent, use parent + id

				// what is the form of the path?

			this.registered = true;
		}
	},
	request: function(){
		if (!this.requested){
			this.script = document.createElement("script");
			this.script.src = this.id;

			// used in global define() function as document.currentScript.module
			this.script.module = this;

			document.head.appendChild(this.script);
			this.requested = true;
		}
	},
	path: function(){
		return this.id;
	},
	exec: function(){
		if (!this.dependents.length) console.group(this.path());
		this.value = this.factory.apply(null, this.args());
		this.executed = true;
		if (!this.dependents.length) console.groupEnd();
		this.finish();
	},
	finish: function(){
		for (var i = 0; i < this.dependents.length; i++){
			this.dependents[i].update();
		}
		this.finished = true;
	},
	update: function(){
		if (this.ready())
			this.exec();
	},
	dq: function(dep){
		// remove dep from the q?  is doing a bunch of array splices any faster?
	},
	ready: function(){
		for (var i = 0; i < this.deps.length; i++){
			if (!this.deps[i].executed)
				return false;
		}
		return true;
	},
	args: function(){
		var dep, args = [];
		for (var i = 0; i < this.deps.length; i++){
			dep = this.deps[i];
			if (dep.executed)
				args.push(dep.value);
			else
				throw "whoops";
		}
		return args;
	}
})

/*
To keep define().define() working...
But, that'll have to be mangled anyway, because we can't then have multiple define().define().define() at the same parent level.

How about skip the whole root concept, and just go back to the new Module()?

All new modules could be registered as root modules.

Fark..  Not sure about this:
* IDing modules?
* Embedding sub modules vs Shared
* How to cache and look up modules?


Root modules might not need to be cached...

*/

var define = window.define = function(){
	var script = document.currentScript,
		module;
	if (script && script.module){
		module = script.module;
	} else {
		module = new Module();
	}
	module.define.apply(module, arguments);
	return module;
};

define.modules = modules;
define.getModule = getModule;

})();
