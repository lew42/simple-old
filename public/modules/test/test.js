define("Test/", ["Base2/", "View/"], function(Base2, View){

/*
instead of trying to use a view, and have view.name and view.$name, which doesn't work very well with the .append({pojo}) method...

maybe its better to have test.name, test.view, and test.view.name

*/

var TestView = View.extend({

});

var body = View({
	el: document.body
});

var Test = Base2.extend({
	instantiate: function(name, fn){
		this.name = name;
		this.fn = fn;

		this.pass = 0;
		this.fail = 0;

		this.activate.bind(this);
		this.container = this.container || body;

		this.initialize();
	},
	initialize: function(){
		this.render();
		this.exec();
	},
	render: function(){
		this.view = View().addClass('test').append({
			bar: {
				name: this.label(),
				run: View({tag:"button"}, "run").click(this.activate)
			},
			content: View(),
			footer: View()
		});

		if (!this.view.parent)
			this.view.appendTo(this.container);
	},
	activate: function(){
		window.location.hash = this.name;
		window.location.reload();
	},
	label: function(){
		return (this.match() ? "#" : "") + this.name;
	},
	exec: function(){
		if (this.shouldRun()){
			this.view.addClass("active");
			console.group(this.label());
			
			Test.set_captor(this);

			this.content.append(function(){
				this.fn();
			}.bind(this));

			Test.restore_captor();
			
			if (this.pass > 0)
				this.footer.append("Passed " + this.pass);
			if (this.fail > 0)
				this.footer.append("Failed " + this.fail);
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
	}
});

Test.assign({
	previous_captors: [],
	set_captor: function(view){
		this.previous_captors.push(this.captor);
		this.captor = view;
	},
	restore_captor: function(){
		this.captor = this.previous_captors.pop();
	},
	assert: function(value){
		if (Test.captor)
			Test.captor.assert(value);
		else
			console.error("whoops");
	}
});

return Test;
});