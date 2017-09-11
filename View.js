app.module("View", [], function(){

var Base2 = Base.extend();
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

var View = Base2.extend({
	instantiate: function(){
		if (this._auto_append){
			// console.warn("can't really use the .render function with this pattern");
			this.initialize();
			this.append.apply(this, arguments);
		} else {
			this.assign.apply(this, arguments);
			this.initialize(true);
		}
	},
	initialize: function(capture){
		this.render_el();
		this.getCaptured();

		if (capture){
			this.becomeCaptor();
		}

		this.render();
		this.update();

		if (capture){
			this.restoreCaptor();
		}
	},
	render_el: function(){
		this.tag = this.tag || "div";
		this.el = document.createElement(this.tag);

		if (this.name)
			this.addClass(this.name);

		if (this.classes)
			this.addClass.apply(this, this.classes.split(" "));
	},
	addClass: function(){
		for (var i = 0; i < arguments.length; i++){
			this.el.classList.add(arguments[i]);
		}
		return this;
	},
	click: function(cb){
		this.el.addEventListener("click", cb.bind(this));
		return this;
	},
	removeClass: function(className){
		this.el.classList.remove(className);
		return this;
	},
	hasClass: function(className){
		return this.el.classList.contains(className);
	},
	empty: function(){
		this.el.innerHTML = "";
		return this;
	},
	focus: function(){
		this.el.focus();
		return this;
	},
	show: function(){
		this.el.style.display = "";
		return this;
	},
	style: function(){
		return getComputedStyle(this.el);
	},
	toggle: function(){
		if (this.style().display === "none")
			return this.show();
		else {
			return this.hide();
		}
	},
	hide: function(){
		this.el.style.display = "none";
		return this;
	},
	render: function(){},
	update: function(){},
	getCaptured: function(){
		if (View.captor){
			View.captor.append(this);
		}
	},
	becomeCaptor: function(){
		View.previousCaptor = View.captor;
		View.captor = this;
	},
	restoreCaptor: function(){
		View.captor = View.previousCaptor;
	},
	append: function(){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (arg && arg.el){
				this.el.appendChild(arg.el);
			} else if (is.fn(arg)){
				this.becomeCaptor();
				arg.call(this);
				this.restoreCaptor();
			} else  {
				// dom and strings
				this.el.append(arg);
			}
		}
		return this;
	}
});



return View;

});