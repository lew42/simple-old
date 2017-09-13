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
	this.assign.apply(this, arguments);
	this.initialize();
};
Base.prototype.initialize = function(){};

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

var Module = Base.extend({
	initialize: function(){
		if (this.config) this.init_config();
	},
	init_config: function(){
		if (this.config.id) this.id = this.config.id;
		if (this.config.requires) this.dependencies = this.config.requires;
		if (this.config.factory) this.factory = this.config.factory;
	},
	register: function(){
		// should have ID, and optionally a basePath
		// configRoot + basePath (defined by require) + 
	},
	requires: function(deps){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (is.arr(arg))
				this.requires(arg);
			else
				this.require(arg);
		}
		return this;
	},
	require: function(dep){
		// resolve path based on this.basePath
		var mod = new Module({

		});
	}
});


define = function(id, deps, fn){
	var arg, constructs = {};

	// is arg parsing outside the class cleaner?
	// that allows Module({assign}) instead of Module([{assign}]) // as with new Module(arguments) pattern
	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];
		if (is.obj(arg))
			constructs.config = arg;
		else if (is.str(arg))
			constructs.id = arg;
		else if (is.arr(arg))
			constructs.dependencies = arg;
		else if (is.fn(arg))
			constructs.factory = arg;
	}

	return new Module(constructs); // return?  why not
};

})();
