# Object Oriented Sub Modules

We need each module to require and resolve itself...





define(...).define(...);

But, how would have define several sub modules?  You'd have to have something more like a module.defineAll( ["name", ["deps"], fn], ["name2", ["deps2"], fn2], etc);

Or, you let .define() check each array for a function, and if it has a function, the entire array is treated as a group.

So you can have define([...], [...])?

But, that still requires you to take your modules and change them from "define(...)" to.. extract the args, and convert to .define([...]);

That could be done with an AST parser, I suppose.

For dev mode, we can use document.currentScript to determine which <script> element is being used.  And, that <script> element can have a .parentModule property that points to the parent module, allowing us to use script.parentModule.define() instead of the global define.

