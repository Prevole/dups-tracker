var
  _ = require('underscore'),
  colors = require('colors')
;

/**
 * The console reporter shows the results on the console with
 * colors and hapiness.
 *
 * @param results The results to show
 */
module.exports = function(results) {
  console.log('\n\n');
  console.log('Comparison by simple names:'.green);
  _.each(results.filesByName, function(fileByName, key) {
    if (fileByName.length > 1) {
      console.log(('  It seems the file ' + key + ' is duplicated.').yellow);
      _.each(fileByName, function(file) {
        console.log('    ' + file.path.blue + (' (md5: ' + file.md5 + ')').magenta);
      });
      console.log('');
    }
  });

  console.log('');
  console.log('Comparison by md5:'.green);
  _.each(results.filesByMd5, function(fileByMd5, key) {
    if (fileByMd5.length > 1) {
      console.log(('  It seems there is a duplicated file for md5: ' + key).yellow);
      _.each(fileByMd5, function(file) {
        console.log('    ' + file.path.blue + (' (md5: ' + file.md5 + ')').magenta);
      });
      console.log('');
    }
  });
};
