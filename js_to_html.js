var fs = require("fs");

var title = "immo scout grabber";
var compiledJs = "main_compiled.js";
var outputHtml = "immo_scout_grabber.html";

fs.readFile(compiledJs, function(err, data) {
  if (err) throw err;
  var result = "javascript:" + encodeURIComponent(data + "undefined;");
  result = "<a href=\"" + result + "\">" + title + "</a>";
  result = "<html><head><title>" + title + "</title></head><body>" + result + "</body></html>";
  fs.writeFile(outputHtml, result, function(err) {
    if (err) throw err;
  });
});
