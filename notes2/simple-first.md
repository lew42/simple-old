# Resolution

If it starts with "/", then we treat it as a site root.
If it starts with "./", then its a relative request, relative to the parent module (not the current page).
If it starts with anything else, it's requested from the module root.


We need a more robust dep path parser...

We need to identify the path vs the file...

relative?
absolute?
module?



No module root.
Visualized.
Monorepo (no pkgs).

"thing" --> /thing.js
"thing/" --> /thing/thing.js
"mod/thing" --> "/mod/thing.js"
"mod/thing/" --> "/mod/thing/thing.js"

module.path()
	returns "/" + this.parts.join("/") + "/", or just "/" if no parts...
		--> "/abs/path/";

module.file = "file.js"

module.src() = this.path() + this.file; 
	// "/absolute/path/file.js"
module.parts = ["abs", "path"];




# Resolution

When a module first requests another, if it hasn't already been registered, it needs to be.

new Module();
module.register(requirer);

The registration basically resolves the path relative to self.



If there is no parent module (!currentScript.parentModule), then we create a new module.  Otherwise, we use parentModule.

--> define() --> define.root.define();


If module matching is based solely on this currentScript system, then we don't really need to define IDs.  We'll have one module per file.  And when that module is defined, it'll be linked up to the module already registered.

What if we want to define multiple modules per file?  I could come back to that later.

Also, what if we try to redefine a module?  Well, if its 1 per file, and we cache them based on the request path.. maybe we don't have much of an issue?





Skip pkg system?

Or, just rely on pkg/ pattern?

These are really my own modules I'm going to be using.  So worrying about a distributed module system right now is kinda silly.

I'm perfectly capable of managing my own modules.  And I'll just have to be sure I don't try to dupe up the namespace.



So, packages can have their own configuration for module lookups?

Or maybe it's just way easier to make pkgs use local lookups (../../) rather than config a global module root per pkg ("thing").

The package could have its own module root, that's defined with the root package.  But, then we would need an escape hatch in order to jump outside of the subpkg's root.

And if we want a package to use other packages:

"pkg/thing"

And have that also work when embedded into another site...



# remote packages

The idea behind pkg/ dir, is that they can be independently version controlled, and can be... "external" packages.

In reality, remote packages are likely.

Can we ID a package just by a URL?

Can we require http://www.cdn.com/js/whatever.js?
And rely on AMD and/or UMD?


# define.pkg()

One advantage here, is that when we know something is a package, we can always treat its defines() and resolves() as... relative.

So, inside pkg/a/
require "thing"
could use pkg/a's config to resolve it differently

Yet, again, the tricky part is that you might want to share modules.  If you want pkg/a/ to be able to use the global 'thing', then you don't necessarily want it to try to resolve locally...

I think we could do something like npm, only instead of doing automatic fallbacks, we could just configure everything from the site level.  But that's so far down the line...