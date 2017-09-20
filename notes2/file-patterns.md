site/

or

my-pkg/

Shouldn't really matter?
* define modules: "pre/fix"


define({
	id: "name-0.1.2",
	modules: "prefix",
	dependencies: [],
	factory: function(){}
});

If /mod/ is used, then "global" requires will begin from their.
You could then use "pkg/vendor-pkg/" to require a vendor pkg.

Packages could have their own config...

define({
	modules: "pkg"
});

The trick is, when loading any package, all of its dependencies are then required based on the parent's config.

So, if 

my-pkg/
	one/
	"thing" --> "one/thing"

And then

site/
	/two/
		pkg/
			my-pkg/...
	"pkg/my-pkg" --> two/pkg/my-pkg
						--> "thing"

A package could define its own module root, but then they have to be embedded...

If a package is to use shared packages, it needs to define a "packages" directory?

That's why using a standard system is best.  If you always put packages into pkg/, then require "pkg/...", then you can attempt to set it up properly?

What if you have... virtual dir mappings?

Like, map "pkg" to "packages"?

If you need a package to lookup sub pkgs locally instead of globally, you could somehow specify this?


I think that's why there needs to be a global pkg/ namespace.  All modules have a name-X.Y.Z, so that 2 pkgs can require different pkg versions.  And you can install many pkgs without worrying.

You could even have package bundles, where pkg/bundle/ is a brand new namespace:

pkg/namespace/thing
vs 
pkg/other/thing




Versioning:  start at 0.0.0, and you're working towards version 1?




All this pre-planning is kinda futile.  I don't know if it'll ever really matter.  I really just want my own packages.  If 2 packages happen to share a namespace, well, tough?