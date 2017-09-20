/*
 * window.define
 */

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

		this.q = [];
		this.parts = []; // ["abs", "path"]
		this.dep_ids = []; // array of dep ids (strings)
		this.deps = []; // dependencies (Module instances)
		this.dependents = [];
	},
	define: function(){
		this.log.group("define", this.id || document.currentScript.src);
		this.define_args(arguments);
		this.define_deps();
		this.log.g("q", () => this.q.forEach((dep) => this.log(dep.id)));
		this.defined = true;

		if (!this.q.length)
			this.exec();

		this.log.end();
	},
	define_args: function(args){
		var arg;
		for (var i = 0; i < args.length; i++){
			arg = args[i];
			if (is.arr(arg)){
				this.dep_ids = arg;
			} else if (is.fn(arg)){
				this.factory = arg;
			} else if (is.str(arg)){
				this.id = arg;
			}
		}
	},
	define_deps: function(){
		this.dep_ids.forEach(function(dep_id){
			this.require(dep_id);
		}.bind(this));
	},
	resolve: function(token){
		return "/modules/" + token + ".js";
	},
	load: function(id){
		var module;
		if (this.modules[id]){
			module = this.modules[id];
		} else {
			module = this.modules[id] = new Module({
				id: id
			});
			module.request();
		}
		return module;
	},
	require: function(token){
		// resolve token based on this.path
		var id = this.resolve(token);
		var module = this.load(id);

		// all deps
		this.deps.push(module);
		
		// awaiting deps
		if (!module.executed)
			this.q.push(module);

		// deps track dependents, too
		module.dependents.push(this);
	},
	request: function(){
		if (!this.requested){
			this.script = document.createElement("script");
			this.script.src = this.id;

			// used in global define() function as document.currentScript.module
			this.script.module = this;

			this.requested = true;
			this.log("requesting", this.id);
			document.head.appendChild(this.script);
		}
	},
	exec: function(){
		// if (!this.dependents.length) console.group(this.id);
		this.log.group("exec", this.id);
		this.value = this.factory.apply(null, this.args());
		this.executed = true;
		// if (!this.dependents.length) console.groupEnd();
		this.log.end();
		this.finish();
	},
	finish: function(){
		for (var i = 0; i < this.dependents.length; i++){
			// this.dependents[i].update();
			this.dependents[i].dq(this);
		}
		this.finished = true;
	},
	dq: function(dep){
		var index = this.q.indexOf(dep);
		if (index > -1){
			this.q.splice(index, 1);
		} else {
			console.error("dep not found");
		}

		if (!this.q.length){
			this.exec();
		}
	},
	update: function(){
		if (!this.executed && this.ready())
			this.exec();
	},
	ready: function(){
		for (var i = 0; i < this.deps.length; i++){
			if (!this.deps[i].executed)
				return false;
		}
		this.log(this.id, "is ready");
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

logger.install(Module.prototype, true);


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

})();
