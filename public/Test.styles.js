app.module("Test.styles.js", ["CSS.js"], function(CSS){

var styles = new CSS();

styles.select("body", "background: purple;");

return styles;
});