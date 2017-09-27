
/*

"thing" --> moduleRoot + /thing.js
"thing.js" --> moduleRoot + /thing.js
"thing.css" --> moduleRoot + /thing.css?

"thing/" --> moduleRoot/ + thing/thing.js
"one/two/three/thing/" --> moduleRoot/ + one/two/three/thing/thing.js

"/thing" --> /thing.js
"/thing.js" --> /thing.js"
"/thing.css" --> /thing.css

"/thing/" --> /thing/thing.js
"one/t"

"thing-0.1.2"

*/
// [
// 	{
// 		id: "thing",
// 		url: "/modules/thing.js"
// 	},
// 	{
// 		id: "thing.js",
// 		url: "/modules/thing.js"
// 	},
// 	{
// 		id: "thing-0.1",
// 		url: "/modules/thing-0.1.js"
// 	},
// 	{
// 		id: "thing-0.1/",
// 		url: "/modules/thing-0.1/thing-0.1.js"
// 	},
// 	{
// 		id: "/thing",
// 		url: "/thing.js"
// 	},
// 	{
// 		id: "/thing-0.1",
// 		url: "/thing-0.1.js"
// 	},
// 	{
// 		id: "/thing.js",
// 		url: "/thing.js"
// 	},
// 	{
// 		id: "/thing-0.1.js",
// 		url: "/thing-0.1.js"
// 	},
// 	{
// 		id: "/thing/",
// 		url: "/thing/thing.js"
// 	},
// 	{
// 		id: "/thing-0.1/",
// 		url: "/thing-0.1/thing-0.1.js"
// 	}
// ].forEach((test)=>{
// 	console.assert(define.resolve(test.id) === test.url);
// 	console.log("done");
// });
