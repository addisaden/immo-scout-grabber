var VirtualBrowser = require("./virtualbrowser.js");

var scanDocument = function(doc) {
  var el = doc.getElementsByClassName("resultlist_entry_data");

  var results = [].slice.call(el).map(function(e) {
    return e.childNodes[1].childNodes[1].childNodes[1].href;
  });

  return results;
};

var search_window = VirtualBrowser.master(function(link, suchobject) {
  var formular = this.document.body.getElementsByClassName("parbase sectionheader section")[0];
  [].slice.call(this.document.body.childNodes).map((function(e) { this.document.body.removeChild(e); }).bind(this));
  this.document.body.appendChild(formular);

  // add a watcher. alerts when change the site
  var watcher = {};
  watcher.url = this.window.location.href;

  setInterval((function(href) {
    if(watcher.url != this.window.location.href) {
      watcher.url = this.window.location.href;

      // test if site is a searchsite
      var results = scanDocument(this.window.document);
      if(results.length > 0) {
        for(var i in results) {
          suchobject.push(results[i]);
        }
        this.window.alert("results found");
      }
    }
  }).bind(this, watcher), 50);
});

exports.start = function(suchobject) {
  search_window("http://www.immobilienscout24.de/", suchobject);
}
