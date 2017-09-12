app.module("CSS.js", [], function(){

var CSS = Base.extend({
	instantiate: function(){
		this.str = "";
	},
	select: function(selector, strs){
		this.str += selector + "{";
		for (var i = 0; i < strs.length; i++){
			this.str += strs[i];
		}
		this.str += "}";
		return this;
	},
	inject: function(){
		this.el = document.createElement("style");
		this.el.innerText = this.str;
		document.head.appendChild(this.el);
	}
});

return CSS;
});