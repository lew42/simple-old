So, pkgs should just use default global module root?


site/
	public/
		mod/
			pkg/
				thing/
				my-pkg/ (mR default to "/")
					pkg/
						thing
					require "pkg/thing"


Pkgs shouldn't use "thing".
If they need local mods, they use "./".
Pkgs should use "pkg/thing" to harmonize dev and site mode.


The best way I see packages working:

All uses of packages (sites and packages themselves), should have a /pkg/ directory, that's either at the web/site/repo root, or inside the global modules directory.

In fact, the pkg/ dir MUST be at the global module dir...

The default configuration is that pkgs aren't embedded.
Yet, if you have version conflicts, you could easily configure a specific pkg to actually use its own /pkg/ dir.

That way, you can use global pkgs by default, and then reconfigure.

If you just want to embed the module, just put it directly in the mod/ directory, and you can ignore it yourself...

Ugh - I don't really like this setup.  I think it'll work, but it's not particularly a great setup.

The issue is with naming modules, and keeping a ton of modules and their versions straight.

I feel like a checksum should be used to identify certain versions, and ensure that you're always using the right version...


So, the thing is - if pkgs wanted to try to share packages... Then we need that escape hatch to say, "pkg/thing" should ignore the packages moduleRoot, and instead climb to siteModuleRoot...?

Like, /pkg/thing/?


## Or..?

Or, all packages use the same define moduleRoot.  So, when you're using a package within a site, then "pkg/thing" will be rooted.  And "thing" will be rooted.

dev-site/
	.git/
	node_modules/
	package.json
	public/
		mod/
			pkg/
		routes/
		index.html
		index.js

Packages can't easily use the "public" dir, nor have node_modules, because then they'd be served.

Should all moduleRoots be configurable?  Doesn't this make things that much harder to understand?  Where is it loaded from?

Sure, you could visualize it - create the admin that identifies the actual URL.




