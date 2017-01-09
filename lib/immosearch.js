var VirtualBrowser = require("./virtualbrowser.js");

var scanDocument = function(doc) {
  var el = doc.getElementsByClassName("result-list-entry");

  var results = [].slice.call(el).map(function(e) {
    return e.getElementsByClassName("result-list-entry__brand-title-container")[0].href;
  });

  return results;
};



var search_iframe = VirtualBrowser.iframe(function(link, suchobject, tab, callback) {
  var results = scanDocument(this.document);

  for(var i in results) {
    suchobject.push(results[i]);
  }

  try {
    var nextPage = [].slice.apply(this.document.getElementsByTagName("a")).filter(function(e) {
      return e.getAttribute('data-is24-qa') == 'paging_bottom_next';
    })[0].href;
  }
  catch(e) {
    var nextPage = undefined;
  }

  if(nextPage) {
    console.log("Nächste Seite wird gescannt.");
    search_iframe(nextPage, suchobject, tab, callback);
  } else {
    console.log("Keine Seite mehr.");
    callback();
    tab.close();
  }
});



var search_window = VirtualBrowser.master(function(link, suchobject, callback) {
  var formular = this.document.body.getElementsByClassName("main-search__content--oss")[0];
  [].slice.call(this.document.body.childNodes).map((function(e) { this.document.body.removeChild(e); }).bind(this));
  this.document.body.appendChild(formular);

  // add a watcher. alerts when change the site
  var watcher = {};

  var intervalId = setInterval((function(href) {
    // IS NEW SITE ??? if(document_hash(this.document).match('expose')) {

      // test if site is a searchsite
      var results = scanDocument(this.window.document);
      if(results.length > 0) {
        if(this.window.confirm("Möchten Sie diese Seite verwenden?")) {
          clearInterval(intervalId);
          for(var i in results) {
            suchobject.push(results[i]);
          }

          try {
            var nextPage = [].slice.apply(this.window.document.getElementsByTagName("a")).filter(function(e) {
              return e.getAttribute('data-is24-qa') == 'paging_bottom_next';
            })[0].href;
          }
          catch(e) {
            var nextPage = undefined;
          }

          console.log("nextPage");
          console.log(nextPage);

          if(nextPage) {
            console.log("Nächste Seite wird gescannt.");
            search_iframe(nextPage, suchobject, this.tab, callback);
          } else {
            console.log("Keine Seite mehr.");
            callback();
            this.tab.close();
          }
        }
      }
    // }
  }).bind(this, watcher), 50);
});

exports.start = function(suchobject, callback) {
  search_window("http://www.immobilienscout24.de/", suchobject, callback);
}
