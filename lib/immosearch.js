var VirtualBrowser = require("./virtualbrowser.js");

var scanDocument = function(doc) {
  var el = doc.getElementsByClassName("resultlist_entry_data");

  var results = [].slice.call(el).map(function(e) {
    return e.childNodes[1].childNodes[1].childNodes[1].href;
  });

  return results;
};



var search_iframe = VirtualBrowser.iframe(function(link, suchobject, tab, callback) {
  var results = scanDocument(this.document);

  for(var i in results) {
    suchobject.push(results[i]);
  }

  try {
    var nextPage = this.document.getElementById("pager_next").getElementsByTagName("a")[0].href;
  }
  catch(e) {
    var nextPage = undefined;
  }

  if(nextPage) {
    search_iframe(nextPage, suchobject, tab, callback);
  } else {
    callback();
    tab.close();
  }
});



var search_window = VirtualBrowser.master(function(link, suchobject, callback) {
  var formular = this.document.body.getElementsByClassName("parbase sectionheader section")[0];
  [].slice.call(this.document.body.childNodes).map((function(e) { this.document.body.removeChild(e); }).bind(this));
  this.document.body.appendChild(formular);

  // add a watcher. alerts when change the site
  var watcher = {};
  watcher.url = this.window.location.href;

  var intervalId = setInterval((function(href) {
    if(watcher.url != this.window.location.href) {

      // test if site is a searchsite
      var results = scanDocument(this.window.document);
      if(results.length > 0) {
        if(this.window.confirm("Möchten Sie diese Seite verwenden?")) {
          clearInterval(intervalId);
          for(var i in results) {
            suchobject.push(results[i]);
          }

          try {
            var nextPage = this.window.document.getElementById("pager_next").getElementsByTagName("a")[0].href;
          }
          catch(e) {
            var nextPage = undefined;
          }

          if(nextPage) {
            this.window.alert("Bitte haben Sie ein wenig geduld, bis die Suchergebnisse gesamelt wurden.");
            search_iframe(nextPage, suchobject, this.tab, callback);
          } else {
            callback();
            this.tab.close();
          }
        }
      }
    }
  }).bind(this, watcher), 50);
});

exports.start = function(suchobject, callback) {
  search_window("http://www.immobilienscout24.de/", suchobject, callback);
}
