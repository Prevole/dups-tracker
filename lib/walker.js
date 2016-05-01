var
  Promise = require('bluebird'),
  fs = require('fs-extra'),
  path = require('path'),
  through2 = require('through2'),
  exif = require('fast-exif'),
  Minimatch = require('minimatch').Minimatch,
  _ = require('underscore'),
  md5 = require('md5-file'),
  colors = require('colors')
;

/**
 * Walker to go through the file system directories given by the directory iterator
 *
 * @param config The main configuration
 * @returns {{filesByName: {}, filesByMd5: {}, excludes: [ String ], directoryIterator: *}} The walker
 */
module.exports = function(config) {
  // Define the picture extensions
  var exts = [ /jp(e)?g$/i, /gif$/i, /png$/i ];

  /**
   * The walker that contains the files by names and md5 and the directory iterator
   * @type {{filesByName: {}, filesByMd5: {}, directoryIterator: *}}
   */
  var walker = _.defaults(_.pick(config, 'directoryIterator', 'excludes'), {
    filesByName: {},
    filesByMd5: {},
    excludes: [],
    directoryIterator: []
  });

  // Prepare minimatch objects for excludes
  walker.excludes = _.map(walker.excludes, function(exclude) {
    return new Minimatch(exclude);
  });

  _.extend(walker, {
    /**
     * The walk function to iterate over all the directories from the
     * directory iterator. The walk is combined for all the directories
     * in the iterator.
     */
    walk: function() {
      return new Promise(_.bind(function(resolve, reject) {
        fs.walk(this.directoryIterator.next())
          .pipe(through2.obj(function(item, enc, next) {
            // Check if the current item must be excluded
            var shouldBeExcluded = walker.excludes.some(function(exclude) {
              return exclude.match(item.path);
            });

            // Add the item for later processing
            if (!shouldBeExcluded) {
              this.push(item);

              // Check if we face an image file
              var findExt = exts.some(function(ext) {
                return path.extname(item.path).match(ext);
              });

              // Image file encountered
              if (findExt) {
                // Read exif data
                exif.read(item.path).then(function(exifData) {
                  item.exifData = exifData;
                  next();
                });
              }
              else {
                // Should only happen when file is not an image due to promise
                next();
              }
            }
            else {
              // Should only happen when file is excluded due to promise
              next();
            }
          }))
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
