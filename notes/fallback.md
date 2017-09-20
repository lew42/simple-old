# falling back

In node, when we require "something", there's an algorithm that looks in a dozen locations to find "something".

In the browser, I'm trying to avoid unnecessary requests.  Even though, I've kind of already disregarded performance.


So, falling back could be implemented.  I think we'd need to use a script onload handler and error handler in order to detect 404s.