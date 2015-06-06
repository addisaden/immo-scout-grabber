var VirtualBrowser = require("./lib/virtualbrowser.js");

if(window.location.host != "www.immobilienscout24.de") {
  if(confirm("You're not on \"www.immobilienscout24.de\". " +
        "Would you like to redirect? " +
        "You should run this script again")) {
    window.location = "http://www.immobilienscout24.de/";
  }
} else {
  var search_window = VirtualBrowser.master(function() {
    var formular = this.document.body.getElementsByClassName("parbase sectionheader section")[0];
    [].slice.call(this.document.body.childNodes).map((function(e) { this.document.body.removeChild(e); }).bind(this));

    var close_button = this.document.createElement("h2");
    close_button.setAttribute("style", "color: red; cursor: pointer;");
    close_button.onclick = this.tab.close.bind(this.tab);
    close_button.appendChild(this.document.createTextNode("Bitte hier klicken um das Fenster zu schließen."));

    this.document.body.appendChild(close_button);
    this.document.body.appendChild(formular);

    // add a watcher. alerts when change the site
    var watcher = {};
    watcher.url = this.window.location.href;

    setInterval((function(href) {
      if(watcher.url != this.window.location.href) {
        watcher.url = this.window.location.href;
        this.window.alert("Url Changed to " + watcher.url);
      }
    }).bind(this, watcher), 50);
  });

  [].slice.call(document.body.childNodes).map(function(e) {
    document.body.removeChild(e);
  });

  var header = document.createElement("h1");
  header.appendChild(document.createTextNode("Immobilien Scout24 Grabber"));
  document.body.appendChild(header);

  search_window("http://www.immobilienscout24.de/");
}
