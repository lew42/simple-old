define("thing/thing.tests", ["thing/", "test/", "View/"], function(Thing, Test, View){

Test("thing 1", function(){
	log("the value of thing", Thing);
});

})