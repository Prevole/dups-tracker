var
  glob = require('glob'),
  path = require('path')
;

/**
 * Load the available reporters
 */
module.exports = function() {
  var reporters = {};

  // Load the reporters
  glob.sync(path.join(__dirname, '**/reporter.js')).forEach(function (fileReporter) {
    reporters[fileReporter.replace('/reporter.js', '').replace(/.*\//, '')] = require(fileReporter.replace(/.*\/reporters\//, './'));
  });

  return reporters;
}();
