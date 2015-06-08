var ImmoSearch = require("./immosearch.js");

module.exports = function(w) {
  this.window = w;
  this.searchresults = {};

  [].slice.call(this.window.document.body.childNodes).map((function(e) {
    this.window.document.body.removeChild(e);
  }).bind(this));

  var header = this.window.document.createElement("h1");
  header.appendChild(this.window.document.createTextNode("Immobilien Scout24 Grabber"));
  this.window.document.body.appendChild(header);

  var createSearch = this.window.document.createElement("h3");
  createSearch.setAttribute("style", "cursor: pointer");
  createSearch.appendChild(this.window.document.createTextNode("Starte neue Suche"));
  createSearch.onclick = (function() {
    var searchtitle = this.window.prompt("Wie möchten Sie die Suche nennen?");
    this.searchresults.search = this.searchresults.search || {};
    var suche = this.searchresults.search[searchtitle] = [];
    ImmoSearch.start(suche);
  }).bind(this);
  this.window.document.body.appendChild(createSearch);
}
