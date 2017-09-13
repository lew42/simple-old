app.module("Test.js", ["View.js", "Test.styles.js"], function(View, styles){
	styles.inject();
	
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
				this.$run = View({tag: "button", test: this}).addClass("run").append("run")
					.click(function(){
						window.location.hash = this.test.testName;
						window.location.reload();

					})
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
				if (this.pass > 0)
					this.$footer.append("Passed " + this.pass);
				if (this.fail > 0)
					this.$footer.append("Failed " + this.fail);
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
			return window.location.hash.substring(1) === this.testName;
		},
	});

	var assert = window.assert = Test.assert = function(value){
		if (View.captor && View.captor.test)
			View.captor.test.assert(value);
	};
});