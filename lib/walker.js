var
  Promise = require('bluebird'),
  fs = require('fs-extra'),
  _ = require('underscore'),
  md5 = require('md5-file'),
  colors = require('colors')
;

/**
 * Walker to go through the file system directories given by the directory iterator
 *
 * @param directoryIterator The directory iterator
 * @returns {{filesByName: {}, filesByMd5: {}, directoryIterator: *}} The walker
 */
module.exports = function(directoryIterator) {
  /**
   * The walker that contains the files by names and md5 and the directory iterator
   * @type {{filesByName: {}, filesByMd5: {}, directoryIterator: *}}
   */
  var walker = {
    filesByName: {},
    filesByMd5: {},
    directoryIterator: directoryIterator
  };

  _.extend(walker, {
    /**
     * The walk function to iterate over all the directories from the
     * directory iterator. The walk is combined for all the directories
     * in the iterator.
     */
    walk: function() {
      return new Promise(_.bind(function(resolve, reject) {
        fs.walk(this.directoryIterator.next())
          .on('data', _.bind(function(pathItem) {
            if (pathItem.stats.isDirectory()) {
              process.stdout.write('.'.cyan);
            }

            // Check if the current path item is a file
            if (pathItem.stats.isFile()) {
              // Enrich file info
              pathItem.fileName = pathItem.path.replace(/.*\//, '');
              pathItem.md5 = md5(pathItem.path);

              // Check if we already registered this file
              if (_.isUndefined(this.filesByName[ pathItem.fileName ])) {
                this.filesByName[ pathItem.fileName ] = [];
              }

              // Add the file to the by name collection
              this.filesByName[ pathItem.fileName ].push(pathItem);

              // Check if the md5 collection contains the current path item
              if (_.isUndefined(this.filesByMd5[ pathItem.md5 ])) {
                this.filesByMd5[ pathItem.md5 ] = [];
              }

              // Store the path item by md5 reference
              this.filesByMd5[ pathItem.md5 ].push(pathItem);
            }
          }, this))
          .on('end', _.bind(function() {
            // Check if there is more directory to walk
            if (this.directoryIterator.hasNext()) {
              resolve(this.walk());
            }
            else {
              // Finally resolve
              resolve({
                filesByName: this.filesByName,
                filesByMd5: this.filesByMd5
              });
            }
          }, this));
      }, this));
    }
  });

  return walker;
};
