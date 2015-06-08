if(window.location.host != "www.immobilienscout24.de") {
  if(confirm("You're not on \"www.immobilienscout24.de\". " +
        "Would you like to redirect? " +
        "You should run this script again")) {
    window.location = "http://www.immobilienscout24.de/";
  }
} else {
  var WebApp = require("./lib/webapp.js");
  window.WebApp = new WebApp(window);
}
