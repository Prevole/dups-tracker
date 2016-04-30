var
  fs = require('fs-extra'),
  path = require('path'),
  _ = require('underscore')
;

module.exports = function(results, options) {
  var htmlContent = {
    content: '<!DOCTYPE html><html><head><title>DUPS Tracker Report</title></head><html><body>'
  };

  /**
   * Easy way to happen content to the buffer
   */
  _.extend(htmlContent, {
    append: function(str) {
      this.content += str;
    }
  });

  htmlContent.append('<h1>');
  htmlContent.append('Comparison by simple names:');
  htmlContent.append('</h1>');

  htmlContent.append('<table><thead><tr><th></th></tr></thead><tbody>');

  _.each(results.filesByName, function(fileByName, key) {
    if (fileByName.length > 1) {
      htmlContent.append('<tr><td style="color: orangered;font-weight: bold;">It seems the file ' + key + ' is duplicated.</td></tr>');

      _.each(fileByName, function(file) {
        htmlContent.append('<tr><td style="padding-left: 10px;">');
        htmlContent.append('<span style="color: blue"><a target="_blank" href="file://' + path.resolve(file.path) + '">' + file.path + '</a></span> <span style="color: magenta;">(md5: ' + file.md5 + ')</span>');
        htmlContent.append('</td></tr>');
      });
    }
  });

  htmlContent.append('</tbody></table>');

  htmlContent.append('<h1>');
  htmlContent.append('Comparison by md5:');
  htmlContent.append('</h1>');

  htmlContent.append('<table><thead><tr><th></th></tr></thead><tbody>');

  _.each(results.filesByMd5, function(fileByMd5, key) {
    if (fileByMd5.length > 1) {
      htmlContent.append('<tr><td style="color: orangered;font-weight: bold;">It seems there is a duplicated file for md5: ' + key + '</td></tr>');

      _.each(fileByMd5, function(file) {
        htmlContent.append('<tr><td style="padding-left: 10px;">');
        htmlContent.append('<span style="color: blue"><a target="_blank" href="file://' + path.resolve(file.path) + '">' + file.path + '</a></span>');
        htmlContent.append('</td></tr>');
      });
    }
  });

  htmlContent.append('</tbody></table>');

  fs.outputFile(path.resolve(options.out), htmlContent.content);
};
