var simple = window.simple = {
	modules: {},
	module: function(){
		if (this.modules)
	}
};


/*

simple.module("name", [], fn)
--> instantiate, instantiate deps OR exec



--> define vs register?

When we 'define' a module with deps, we really just want to register it.

When we pre-create a module when it appears as a dependency, maybe we also just want to register it?


So, new Module --> registers it







module("name", function(){});

module("name", ["dep.js"], function(){
	// appends <script src="dep.js">
	// registers "name" module to run when "dep.js" arrives
});

module("dep.js", function(){
	// registers, no remaining deps, so runs
});

module(function(){
	// anonymous, runs immediately
	// might be otherwise pointless, but avoids IEFE, can be logged/visualized, and could potentially wait until DOM ready?
});

> name is optional
> deps are optional

Can we have a simple value?

module("name", value); // ??

Then use 

simple.module("name") to get it synchronously
// or
simple.module("mine", ["name"], (name) => {
	// to get it using dep inj
});


simple.module("name", ["dep.json", "styles.css"], function(jsonData, cssModule?){
	// json requests should be automatic... (must use xhr)
	// delivering CSS as a string is pointless...
	--> either auto inject CSS, or
	--> import a styles.js module, and execute it (optionally with variables) in order to inject it..
	maybe:

	styles({ /*props/* }).inject();

	or

	new Styles({ settings });

	I feel like using "new" for everything is a little awkward.  For the singleton approach, just export an instance?  Or a function?  Completely up to you...
});





We really need a recursive dep inj pattern...

module("mine", ...)
module("mine.sub", ...) // ?

With asynchrony: series vs parallel
*/