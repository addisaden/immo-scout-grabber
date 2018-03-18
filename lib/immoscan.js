var VirtualBrowser = require("./virtualbrowser.js");

var scanner = VirtualBrowser.window(function(url, current, app, scanarray, resultarray) {
  var xxx = ([].slice.call(this.document.getElementsByClassName("is24-ex-details")[0].getElementsByClassName("criteriagroup")).map(function(i) {
    return [].slice.call(i.getElementsByTagName("dl"));
  }))
 
  var xy = [];
 
  for(var i in xxx) {
    for(var j in xxx[i]) {
      xy.push(xxx[i][j]);
    }
  }
 
 xy.map(function(i) {
   current[i.children[0].textContent.trim()] = i.children[1].textContent.trim();
 });
 
 resultarray.push(current);
 var next = scanarray.pop();
 
 if(next) {
   scanner(next.url, next, app, scanarray, resultarray);
 } else {
   app._immoscan = false;
   app.scanned();
 }
});

exports.scanall = function(app, scanarray, resultarray) {
  if(scanarray.length > 0) {
    app._immoscan = true;
    var next = scanarray.pop()
    scanner(next.url, next, app, scanarray, resultarray);
  }
};
