;(function(){


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
	el: function(value){
		return value && value.nodeType === 1;
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

var console_methods = ["log", "group", "debug", "trace", "error", "warn", "info", "time", "timeEnd"];

var g = function(str, fn){
	this.group(str);
	fn();
	this.end();
};

var gc = function(str, fn){
	this.groupc(str);
	fn();
	this.end();
};

var make_enabled_logger = function(){
	var enabled_logger = console.log.bind(console);
	enabled_logger.enabled = true;
	enabled_logger.disabled = false;

	console_methods.forEach(function(name){
		enabled_logger[name] = console[name].bind(console);
	});

	enabled_logger.groupc = console.groupCollapsed.bind(console);
	enabled_logger.end = console.groupEnd.bind(console);
	enabled_logger.close = function(closure, ctx){
		if (is.fn(closure)){
			closure.call(ctx);
		}
		this.end();
	};

	enabled_logger.g = g;
	enabled_logger.gc = gc;

	enabled_logger.isLogger = true;
	
	return enabled_logger;
};

var enabled_logger = make_enabled_logger();
enabled_logger.on = enabled_logger;

var noop = function(){};

var make_disabled_logger = function(){
	var disabled_logger = function(){};
	disabled_logger.disabled = true;
	disabled_logger.enabled = false;
	console_methods.forEach(function(name){
		disabled_logger[name] = noop;
	});
	disabled_logger.groupc = noop;
	disabled_logger.end = noop;
	disabled_logger.close = function(closure, ctx){
		if (is.fn(closure)){
			closure.call(ctx);
		}
	};
	disabled_logger.g = g;
	disabled_logger.gc = gc;
	
	return disabled_logger;
};

enabled_logger.off = make_disabled_logger();
enabled_logger.off.on = enabled_logger;


window.log = enabled_logger;
})();