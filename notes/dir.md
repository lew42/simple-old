# Directory patterns


## /public/ ?
Sites don't need a /public/, but if they want node_modules and live reload, they should (so you don't have to configure your watch, and so you're not serving the entire node_modules/).

## /modules/ ?
Sites don't need a /modules/ dir.  And, this can be called whatever you want, but /modules/ makes sense.

But, if you want a tpl/ directory, do you want /modules/tpl/?
Or, do you want to leave the modules directory at the root, and just organize your modules from there?

require "tpl/whatever" --> webroot/modules/tpl/whatever
					or --> webroot/tpl/whatever

It's really up to you.

## a package-root syntax? "/yo"
If no prefix "yo" means global/module root, then maybe "/yo" means package root.

I'm not sure how that would be distinguished.  Maybe you'd have to define.package or something?


## package development

For much of your initial code, you might be building things that you might want to reuse.  Form components, layout templates, etc.

We can't easily have a 


Package: "./relative" vs "global"
If globals are for the external packages, but we've already said that external packages should be gitignored, and stored in their own /pkg/ dir...

Then packages can't really use "global" syntax.  When imported, that would then look to the site's module root, which should have "local" site packages...

So, when packages are using other packages, they should require "pkg/name".

And, when packages are using local modules, they must use "./relative" paths.

So, can packages, then, not have a root?  Yes, I suppose not.