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

var console_methods = ["log", "group", "debug", "trace", "error", "warn", "info"];

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

	enabled_logger.inline = function(value){
		if (is.fn(value))
			return "<fn" + (value.name ? " " + value.name : "") + ">";
		return value;
	};

	enabled_logger.g = g;
	enabled_logger.gc = gc;

	enabled_logger.isLogger = true;

	var objLabel = function(obj){
		var proto = obj.constructor.prototype === obj ? ".prototype" : "";
		return obj.name + "{" + obj.constructor.name + proto + "-" + obj.id + "}"; 
	};

	enabled_logger.labelize = function(value){
		// return simple values, but refactor objects and functions
		if (is.fn(value))
			return "<fn" + value.name ? value.name : "" + ">";
		else if (is.obj(value))
			return objLabel(value);
		else
			return value;
	};
	
	return enabled_logger;
};

var enabled_logger = make_enabled_logger();

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
	disabled_logger.inline = noop;

	disabled_logger.g = g;
	disabled_logger.gc = gc;

	disabled_logger.isLogger = true;

	disabled_logger.labelize = noop;
	
	return disabled_logger;
};

var disabled_logger = make_disabled_logger();

var global_logger;
var global_state_chain = [];

var logger = function(value){
	if (typeof value === "boolean")
		return value ? enabled_logger : disabled_logger;
	else if (value && value.isLogger){
		return value;
	} else {
		return global_logger; // a variable assignment, either an enabled logger or diasbled, which represents the current "state"
	}
};

// probably not necessary
// logger.enabled_logger = enabled_logger;
// logger.disabled_logger = disabled_logger;

// this.log.logger
enabled_logger.logger = logger;
disabled_logger.logger = logger;


var global_enabled_logger = make_enabled_logger();
global_enabled_logger.auto = true;

var global_disabled_logger = make_disabled_logger();
global_disabled_logger.auto = true;



logger.on = function(closure, ctx){
	logger.enabled = true;
	logger.disabled = false;
	global_state_chain.push(true);
	global_logger = global_enabled_logger;

	if (closure){
		closure.call(ctx, global_logger);
		logger.restore();
	}
};

logger.off = function(closure, ctx){
	logger.disabled = true;
	logger.enabled = false;
	global_state_chain.push(false);
	global_logger = global_disabled_logger;

	if (closure){
		closure.call(ctx, global_logger);
		logger.restore();
	}
};

// logger defaults to off
/*
You have to use logger.on() to turn all auto-loggers on
Or use logger.on() and then .restore() to do so temporarily
Or use logger.on(function(){}, this) to auto restore.
Or, use this.log = true/false/"auto"
Method will listen to this.log.enabled, and if its turned on, then each method will automatically set global logger to on, and then restore
*/
logger.off();

logger.restore = function(){
	global_state_chain.pop();
	var previous_state = global_state_chain[global_state_chain.length - 1];
	
	logger.enabled = previous_state;
	logger.disabled = !previous_state;

	global_logger = previous_state ? global_enabled_logger : global_disabled_logger;
}.bind(logger);

// use these to conveniently use/restore the override state of another module
enabled_logger.override = logger.on;
disabled_logger.override = logger.off;

enabled_logger.on = logger.on;
enabled_logger.off = logger.off;
enabled_logger.restore = logger.restore;
enabled_logger.value = true;

disabled_logger.on = logger.on;
disabled_logger.off = logger.off;
disabled_logger.restore = logger.restore;
disabled_logger.value = false;

global_disabled_logger.on = logger.on;
global_disabled_logger.off = logger.off;
global_disabled_logger.restore = logger.restore;

global_enabled_logger.on = logger.on;
global_enabled_logger.off = logger.off;
global_enabled_logger.restore = logger.restore;


// value: leave as undefined for global_logger / auto mode
// 		true/false for override
logger.install = function(mod, value){
	Object.defineProperty(mod, "log", {
		configurable: true,
		get: function(){
			return logger(value);
		},
		set: function(new_value){
			if (this.hasOwnProperty("log"))
				value = new_value;
			else
				logger.install(this, new_value);
		}
	});
	(function(){}).prototype = mod;
};

window.logger = logger;
})();