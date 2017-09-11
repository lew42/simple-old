app.module("Test.js", ["View.js"], function(View){
	var Test = window.test = View.extend({
		type: "test",
		instantiate: function(name, fn){
			this.testName = name;
			this.fn = fn;

			this.pass = 0;
			this.fail = 0;

			this.initialize();
		},
		render: function(){
			this.$bar = View().addClass("bar").append(
				this.$name = View().addClass("name").append(this.label()),
				this.$run = View({tag: "button"}).addClass("run").append("run")
			);

			this.$content = View({test: this}).addClass("content");

			this.$footer = View().addClass("footer");
		},
		label: function(){
			return (this.match() ? "#" : "") + this.testName;
		},
		update: function(){
			if (this.shouldRun()){
				this.addClass("active");
				console.group(this.label());
				this.$content.becomeCaptor();
				this.fn();
				this.$content.restoreCaptor();
				console.groupEnd();
			}
		},
		assert: function(value){
			if (value){
				this.pass++;
			} else {
				console.error("Assertion failed");
				this.fail++;
			}
		},
		shouldRun: function(){
			return !window.location.hash || this.match();
		},
		match: function(){
			return window.location.hash.substring(1) === this.name;
		},
	});

	var assert = window.assert = Test.assert = function(value){
		if (View.captor && View.captor.test)
			View.captor.test.assert(value);
	};
});