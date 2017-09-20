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

var Module = Base.extend({
	instantiate: function(){
		this.assign.apply(this, arguments);

		this.dep_ids = []; // array of dep ids (strings)
		this.deps = []; // dependencies (Module instances)
		this.dependents = [];
	},
	sub: function(){},
	define: function(opts){
		this.assign(opts);

		this.register();

		for (var i = 0; i < this.dep_ids.length; i++)
			this.require(this.dep_ids[i]);

		if (!this.deps.length)
			this.exec();

		this.defined = true;
	},
	require: function(id){
		// resolve path based on this.basePath
		var module = getModule(id);

		// used to generate the .factory args
		this.deps.push(module);

		// dependencies are registered based on parent module's path
		module.register(this);

		if (!module.defined)
			module.request();
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
		if (!this.isRequested){
			this.script = document.createElement("script");
			this.script.src = "/" + this.name + ".js";
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
});

var define = window.define = function(id, deps, fn){
	console.log(document.currentScript);
	var args = {}, arg, module;

	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];
		if (is.str(arg)){
			args.id = arg;
		} else if (is.arr(arg)){
			args.deps = arg;
		} else if (is.fn(arg)){
			args.factory = arg;
		}
	}

	module = getModule(args.id);
	module.define(args);
	return module;
};

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

var define2 = function(){
	var script = document.currentScript,
		module;
	if (script && script.module){
		module = script.module;
	} else {
		module = define.root.sub.apply(define.root, arguments);
	}
	module.define.apply(module, arguments);
	return module;
};

define.root = new Module({

});

define.modules = modules;
define.getModule = getModule;

})();
