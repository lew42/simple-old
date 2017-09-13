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
	Ext.assign = assign;
	Ext.assign(this);
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.prototype.assign.apply(Ext.prototype, arguments);

	return Ext;
};


var modules = {};
var Module = Base.extend({
	instantiate: function(opts){
		this.q = [];
		this.deps = [];
		this.dependents = [];
	},
	define: function(opts){
		this.assign(opts);

		for (var i = 0; i < this.dep_ids.length; i++)
			this.require(this.dep_ids[i]);

		if (!this.deps.length)
			this.exec();

		this.isDefined = true;
	},
	require: function(id){
		// resolve path based on this.basePath
		var module = modules[id] = modules[id] || new Module();
		this.deps.push(module);
		module.dependents.push(this);

		if (!module.isExecuted)
			this.q.push(module);

		if (!module.isDefined)
			module.request();
	},
	request: function(){
		if (!this.isRequested){
			this.script = document.createElement("script");
			this.script.src = "/" + this.name + ".js";
			document.head.appendChild(this.script);
			this.isRequested = true;
		}
	},
	exec: function(){
		this.value = this.factory.apply(null, this.args());
		this.pingback();
	},
	pingback: function(){

	}
});

var getModule = function(id){

};

var define = window.define = function(id, deps, fn){
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

	module = modules[args.id] = modules[args.id] || new Module();
	// module = getModule(args.id);
	module.define(args);
	return module;
};

define.modules = modules;
define.get = function(id){

};

})();
