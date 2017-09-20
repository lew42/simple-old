Maybe we have a standardized version syntax for pkg directories:

/pkg/pkg-0.1.2/pkg.js

So that the -X.Y.Z can be stripped off, and the mimic feature can still know which file to pull in.

This might create a little confusion.  If you're relying on this feature, you would have 2 versions, and 2 pkg.js files.

## So, it might be better to just mimic the version:  pkg/name-0.1.2/name-0.1.2.js