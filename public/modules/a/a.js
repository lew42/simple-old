define("a", ["./sub"], function(sub){
	console.log("sub:", sub);
});

/*

code/
	a/
		modules/
			embedded/embedded.js (must repeat folder name)
			config.moduleBase: "modules"
			config.moduleMimic: true
		index.html
		--> a.js
		sub.js
		tpl/


*/