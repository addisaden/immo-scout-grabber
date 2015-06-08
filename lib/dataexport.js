exports.json = function(data) {
  return JSON.stringify(data);
};

exports.csv = function(data) {
  var results = [];
  results.push([]);
  
  // make header
  for(var i in data) {
    for(var j in data[i]) {
      if(results[0].indexOf(j) === -1) {
        results[0].push(j);
      }
    }
  }

  for(var i in data) {
    var linedata = new Array(results[0].length);
    for(var j in data[i]) {
      var id = results[0].indexOf(j);
      linedata[id] = "\"" + data[i][j].replace(/"/g, "\\\"") + "\"";
    }
    results.push(linedata);
  }

  results[0] = results[0].map(function(e) {
    return "\"" + e.replace(/"/g, "\\\"") + "\"";
  });
  
  results = results.map(function(e) { return e.join(";"); }).join("\r\n");

  return results;
};
