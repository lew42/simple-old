# lifecycle


When we require("./dep"), we need to resolve the path given to the requiring module...

If its a dependency, we register it.



define(["deps"])
require("deps")
	register
		on each require, we can re-validate the path, just for... assurance.





The only real linkage that's needed is the dependencies/dependents lists.


The real task here is to parse the relative requests.





## define --> script.module || new Module();

script.module:
This means the script was pre-registered as a dependency, and it's .module has its .path info, and who initially requested it, and any subsequent requesters who are waiting.

new Module():
We don't know anything about this module.  Currently, I believe the only use case here is the initial/main module...

Both: 
--> module.define(args);


## module.define()

In the case of a brand new module, !registered, no dependents, no path... 

So, we should 'register_orphan' or something, to look at the currentScript's src element, and resolve its path...
* add the src property to an anchor tag, to parse the real url
... this isn't even necessary...

In the case of a registered module, we'll have at least 1 dependent, and we'll have the script's src (which will already be defined and parsed?)
* We could cross reference it anyway?  See how it pans out



1. page request @ "/" or "/path/"
2. index.html requests index.js, or whatever (filename doesn't matter much)
3. index.js (or whatever) can define a named, or anonymous module, optionally with dependencies.
4. dependencies are 'require'd either globally, or relatively.

"thing"
"./thing"
"/thing"

main.js
require deps
resolve dep path
request
	create script, attach .parentModule reference
define() --> document.currentScript..parentModule.define()
	deps? require (recursively)
	no deps, or all deps finished, continue to exec
exec
finish
	notify depedents that we're finished

define(["dep1", "dep2"], function(dep1, dep2){

});

