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
