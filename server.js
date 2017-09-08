var fallback = require('express-history-api-fallback')
var express = require('express')
var app = express()
var root = __dirname;

// app.get("/test/", function(req, res, next){
// 	console.log("hit test");
// 	next();
// });

app.use(express.static(root));

app.use(fallback( root + "/index.html"));

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})