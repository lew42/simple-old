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


var Module = Base.extend({
	instantiate: function(id){
		this.log = define.log;
		this.id = id;
		this.deps = []; // dependencies (Module instances)
		this.dependents = [];
	},
	define: function(fn, deps){
		this.log.group("define", this.id, deps || []);

		this.factory = fn;

		if (deps)
			deps.forEach(this.require.bind(this));

		this.defined = true;

		this.exec();

		this.log.end();
	},
	require: function(id){
		var module = define.get(id);

		// all deps
		this.deps.push(module);

		// deps track dependents, too
		module.dependents.push(this);
	},
	request: function(){
		if (!this.defined && !this.requested){
			this.script = document.createElement("script");
			this.script.src = define.resolve(this.id);

			// used in global define() function as document.currentScript.module
			this.script.module = this;

			this.log("request", this.id);
			this.requested = true;
			document.head.appendChild(this.script);
		}
	},
	exec: function(){
		var args = this.args();

		if (this.executed)
			console.error("whoops");
		
		if (args){
			this.log.group("exec", this.id);
			this.value = this.factory.apply(null, args);
			this.executed = true;
			// if (!this.dependents.length) console.groupEnd();
			this.log.end();
			this.finish();
		}
	},
	finish: function(){
		for (var i = 0; i < this.dependents.length; i++)
			this.dependents[i].exec();
		this.finished = true;
	},
	args: function(){
		var dep, args = [];
		for (var i = 0; i < this.deps.length; i++){
			dep = this.deps[i];
			if (dep.executed)
				args.push(dep.value);
			else
				return false;
		}
		return args;
	}
});

var define = window.define = function(){
	var args = define.args(arguments);
	var script = document.currentScript; 
	var module;

	if (args.id){
		module = define.get(args.id);
	} else if (script && script.module){
		module = script.module;
	}

	define.delayRequests();

	return module.define(args.factory, args.deps);
};
define.log = log;
define.debug = log.off;
define.delayRequests = function(){
	define.debug.time("define.requests timeout");
	if (define.delayRequestsTimeout){
		clearTimeout(define.delayRequestsTimeout);
	}
	define.delayRequestsTimeout = setTimeout(define.requests, 0);
};

define.moduleRoot = "modules";

var modules = define.modules = {};

define.get = function(id){
	return (modules[id] = modules[id] || new Module(id));
};

define.args = function(argu){
	var arg, args = {};
	for (var i = 0; i < argu.length; i++){
		arg = argu[i];
		if (is.str(arg))
			args.id = arg;
		else if (is.arr(arg))
			args.deps = arg;
		else if (is.fn(arg))
			args.factory = arg;
		else
			console.warn("whoops");
	}
	return args;
};

define.requests = function(){
	define.log.g("define.requests", function(){
		define.log.timeEnd("define.requests timeout");
		for (var i in define.modules){
			define.modules[i].request();
		}
	});
};

/*

"thing" --> moduleRoot + /thing.js
"thing.js" --> moduleRoot + /thing.js
"thing.css" --> moduleRoot + /thing.css?

"thing/" --> moduleRoot/ + thing/thing.js
"one/two/three/thing/" --> moduleRoot/ + one/two/three/thing/thing.js

"/thing" --> /thing.js
"/thing.js" --> /thing.js"
"/thing.css" --> /thing.css

"/thing/" --> /thing/thing.js
"one/t"

"thing-0.1.2"

*/
define.resolve = function(id){
	var parts = id.split("/"); // id could be //something.com/something/?
	if (id[id.length-1] === "/"){
		id = id + parts[parts.length-2] + ".js";
	} else if (parts[parts.length-1].indexOf(".js") < 0){
		id = id + ".js";
	}

	if (id[0] !== "/"){
		id = "/" + define.moduleRoot + "/" + id;
	}

	return id;
};

// [
// 	{
// 		id: "thing",
// 		url: "/modules/thing.js"
// 	},
// 	{
// 		id: "thing.js",
// 		url: "/modules/thing.js"
// 	},
// 	{
// 		id: "thing-0.1",
// 		url: "/modules/thing-0.1.js"
// 	},
// 	{
// 		id: "thing-0.1/",
// 		url: "/modules/thing-0.1/thing-0.1.js"
// 	},
// 	{
// 		id: "/thing",
// 		url: "/thing.js"
// 	},
// 	{
// 		id: "/thing-0.1",
// 		url: "/thing-0.1.js"
// 	},
// 	{
// 		id: "/thing.js",
// 		url: "/thing.js"
// 	},
// 	{
// 		id: "/thing-0.1.js",
// 		url: "/thing-0.1.js"
// 	},
// 	{
// 		id: "/thing/",
// 		url: "/thing/thing.js"
// 	},
// 	{
// 		id: "/thing-0.1/",
// 		url: "/thing-0.1/thing-0.1.js"
// 	}
// ].forEach((test)=>{
// 	console.assert(define.resolve(test.id) === test.url);
// 	console.log("done");
// });

})();
