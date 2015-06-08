var ImmoScan = require("./immoscan.js");
var ImmoSearch = require("./immosearch.js");

module.exports = function(w) {
  this.window = w;
  this.searchresults = {};

  // clean body
  [].slice.call(this.window.document.body.childNodes).map((function(e) {
    this.window.document.body.removeChild(e);
  }).bind(this));

  // create header
  var header = this.window.document.createElement("h1");
  header.appendChild(this.window.document.createTextNode("Immobilien Scout24 Grabber"));
  this.window.document.body.appendChild(header);

  // searchbutton
  var createSearch = this.window.document.createElement("h3");
  createSearch.setAttribute("style", "cursor: pointer");
  createSearch.appendChild(this.window.document.createTextNode("Starte neue Suche"));
  createSearch.onclick = (function() {
    var searchtitle = this.window.prompt("Wie möchten Sie die Suche nennen?");
    this.searchresults.search = this.searchresults.search || {};
    var suche = this.searchresults.search[searchtitle] = [];

    ImmoSearch.start(suche, this.newMatches.bind(this));
  }).bind(this);
  this.window.document.body.appendChild(createSearch);

  // scanbutton
  var scanMatches = this.window.document.createElement("h3");
  scanMatches.setAttribute("style", "cursor: pointer");
  this._scanButtonText = this.window.document.createTextNode("Scanne 0 Immobilien");
  scanMatches.appendChild(this._scanButtonText);
  scanMatches.onclick = this.scanall.bind(this);
  this.window.document.body.appendChild(scanMatches);
};

module.exports.prototype.newMatches = function() {
  var lengthOfScan = 0;
  for(var s in this.searchresults.search) {
    for(var i in this.searchresults.search[s]) {
      lengthOfScan += 1;
    }
  }
  this._scanButtonText.textContent = "Scanne "+ lengthOfScan + " Immobilien";
};

module.exports.prototype.scanall = function() {
  this._toScan = this._toScan || [];
  this.data = this.data || [];
  for(var s in this.searchresults.search) {
    for(var i in this.searchresults.search[s]) {
      this._toScan.push({
        search: s,
        url: this.searchresults.search[s][i]
      });
    }
    delete this.searchresults.search[s];
  }
  this._immoscan = false;
  if (this._immoscan == false) {
    ImmoScan.scanall(this, this._toScan, this.data);
  }
};
