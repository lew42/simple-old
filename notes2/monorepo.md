dev/
	.git, node_modules, package.json
	public/
		mod/
			* all modules go here *
		site-name/
			* can run @ /site-name/ or standalone
			* but, if standalone, all dependencies need to be present... --> SYMLINK or BUNDLE

For users targeting github pages, there's no reason they need to use the monorepo.  Unless, like me, they're building other sites AND a github page, and want to share modules.

****
	Remember:  I'll want to bundle things up before going public?
	* at first, its not absolutely necessary, and I could just copy+paste the entire directories
	* but, eventually, instead of that, we could just have a build process that compiles the bundled file(s)...
***


Wouldn't it be nice if we just put modules directly into public/, and then could require them between each other?

public/
	view/
	site/ requires "view"
	another/ requires "site"
	a/
	b/
	a+b/ requires "a" and "b"

It could absolutely work that way.  But, "modules" are a little more... independent and... ?

Well, if you want to require another site, you'd have to do something a little more drastic, like leave the module root at public/, and then require "mod/something" in order to organize the modules in a separate folder.

And, setting up mappings and stuff is a little ridiculous.

We don't want to decide later, "I think I'll move 1/2 my public directories into a /mod/ folder, and then have to refactor all the requires to use 'mod/thing' rather than just 'thing'."

And so, maybe that's the best pattern?

Keep the module root at the root?

The thing is though, that if we're developing standalone static sites within my dev folder, then would we ever even need/want to require another "site"?

Within a site, we might want to require another page.

For example:

/page-1/ requires ("../page-2/");

Maybe we should implement some kind of site root syntax:

require("/page-2/") could work site-wide..?


I think the "/rooted" require's could work well.  At the end of the day, it's all about the script src, right?

Also, we could have other assets as well.

So, we can have something like

modules: "modules"

public/
	modules/
		thing/thing.js
		thing.js
	thing/
	thing.js
	site/
		site.js
	page/
		page.js

Sitewide:

"thing" --> modules/thing.js
"thing/" --> modules/thing/thing.js
"/thing" --> /thing.js
"/thing/" --> /thing/thing.js
	doesn't this even look like a page url?

And the tricky one is the relative requires.  I don't know if it makes sense to just let the server handle them?

"./thing" --> thing.js
"./thing/" --> thing/thing.js
"../thing" --> ../thing.js
"../thing/" --> ../thing/thing.js

I suppose I could start there.. NOPE WRONG.
The only problem with that, is that we require global modules from different URLs.  And then those global modules have sub modules, which they require using "./" relative paths.  

And so, the relative require needs to be relative to the parent module, not the current url.

So, whenever a relative require is used, only then do we need to register the parent module, in order to define the path?

Do these paths simply resolve to absolute paths?
All modules should have an absolute path...

"/thing" --> "/"
"thing" --> "/modules/"

etc.

And when one of those modules makes a relative require, we need to resolve the requester's path + relative path to get an absolute path.

And how do we ID them?

This absolute path is probably as good as any.  So, each module has a .path that is the /path/to/file.js, is always absolute, and absolutely identifies that module.


So, all modules can still be tracked from the global level?

module.register(parent)
optional parent

--> compute .path and set modules[path] = module; 