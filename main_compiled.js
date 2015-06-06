(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.iframe = function(callback) {
  return function(link) {
    var savedArguments = arguments;
    var bs = document.createElement("iframe");
    bs.setAttribute("src", link);
    bs.setAttribute("style", "display: none;");
    bs.onload = (function() {
      var clonedNodes = {
        document: bs.contentDocument.cloneNode(true)
      };
      document.body.removeChild(bs)
      callback.apply(clonedNodes, savedArguments);
    }).bind(this);
    document.body.appendChild(bs);
  }
}



exports.window = function(callback) {
  return function(link) {
    var savedArguments = arguments;
    var bs = window.open(link);
    bs.window.onload = (function() {
      var clonedNodes = {
        document: bs.document.cloneNode(true)
      };
      bs.close();
      callback.apply(clonedNodes, savedArguments);
    }).bind(this);
  };
};



exports.browser = function(callback) {
  return function(link) {
    var savedArguments = arguments;
    var bs = window.open(link);
    bs.window.onload = (function() {
      var clonedNodes = {
        document: bs.document,
        window: bs.window
      };
      callback.apply(clonedNodes, savedArguments);
      bs.close();
    }).bind(this);
  };
};



exports.master = function(callback) {
  return function(link) {
    var savedArguments = arguments;
    var bs = window.open(link);
    bs.window.onload = (function() {
      var clonedNodes = {
        document: bs.document,
        window: bs.window,
        tab: bs
      };
      callback.apply(clonedNodes, savedArguments);
    }).bind(this);
  };
};

},{}],2:[function(require,module,exports){
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
  });

  [].slice.call(document.body.childNodes).map(function(e) {
    document.body.removeChild(e);
  });

  var header = document.createElement("h1");
  header.appendChild(document.createTextNode("Immobilien Scout24 Resultgrabber"));
  document.body.appendChild(header);

  search_window("http://www.immobilienscout24.de/");
}

},{"./lib/virtualbrowser.js":1}]},{},[2]);
