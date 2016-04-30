var
  glob = require('glob')
;

/**
 * Load the available reporters
 */
module.exports = function() {
  var reporters = {};

  // Load the reporters
  glob.sync('./**/reporter.js').forEach(function (fileReporter) {
    reporters[fileReporter.replace('/reporter.js', '').replace(/.*\//, '')] = require(fileReporter.replace(/.*\/reporters\//, './'));
  });

  return reporters;
}();
