var ImmoScan = require("./immoscan.js");
var ImmoSearch = require("./immosearch.js");
var DataExport = require("./dataexport.js");

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

  // Timediff
  this._start = new Date;
  var zeitfenster = this.window.document.createElement("p");
  this._timeString = this.window.document.createTextNode("");
  zeitfenster.appendChild(this._timeString);
  zeitfenster.setAttribute("style", "font-size: 1.3em; color: #f93;");
  this.window.document.body.appendChild(zeitfenster);
  this.timeElapsed();
  setInterval(this.timeElapsed.bind(this), 1000);

  // Export Buttons
  var exporter = this.window.document.createElement("p");
  this.exportDate = this.window.document.createTextNode("Noch keine Daten vorhanden.");
  this.exportCsv = this.window.document.createElement("a");
  this.exportCsv.setAttribute("href", "#");
  this.exportCsv.appendChild(this.window.document.createTextNode("CSV-Datei"));
  this.exportJson = this.window.document.createElement("a");
  this.exportJson.setAttribute("href", "#");
  this.exportJson.appendChild(this.window.document.createTextNode("JSON-Datei"));

  this.window.document.body.appendChild(exporter);
  exporter.appendChild(this.exportDate);
  exporter.appendChild(this.window.document.createElement("br"));
  exporter.appendChild(this.exportCsv);
  exporter.appendChild(this.window.document.createElement("br"));
  exporter.appendChild(this.exportJson);
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

module.exports.prototype.timeElapsed = function() {
  this._timeString.textContent = (((new Date) - this._start) / (1000 * 60)).toFixed(2).replace(".", ",") + " Minuten";
};

module.exports.prototype.scanall = function() {
  this._toScan = this._toScan || [];
  this.data = this.data || [];
  for(var s in this.searchresults.search) {
    for(var i in this.searchresults.search[s]) {
      this._toScan.push({
        search: s,
        url: this.searchresults.search[s][i],
        date: String(new Date)
      });
    }
    delete this.searchresults.search[s];
  }
  this._immoscan = false;
  if (this._immoscan == false) {
    ImmoScan.scanall(this, this._toScan, this.data);
  }
};

module.exports.prototype.scanned = function() {
  this.newMatches();
  this.exportJson.setAttribute(
      "href",
      "data:application/json;charset=utf-8," + encodeURIComponent(DataExport.json(this.data))
      );
  this.exportCsv.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(DataExport.csv(this.data))
      );
  var names = [];
  for(var i in this.data) {
    if(names.indexOf(this.data[i].search) === -1) {
      names.push(this.data[i].search);
    }
  }
  this.exportDate.textContent = this.data.length + " Ergebnisse für " + names.join(", ") + " (" + new Date + ")";
}
