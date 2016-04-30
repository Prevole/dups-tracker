var
  _ = require('underscore')
;

/**
 * Directory iterator
 *
 * @param directories The directories to iterate
 * @returns {{directories: *, current: number}} The directory iterator
 */
module.exports = function(directories) {
  var directoryIterator = {
    directories: directories,
    current: 0
  };

  _.extend(directoryIterator, {
    /**
     * @returns {boolean} True if there is more directory to walk
     */
    hasNext: function() {
      return this.current < this.directories.length;
    },

    /**
     * @returns {*} The next directory
     */
    next: function() {
      return this.directories[this.current++];
    }
  });

  return directoryIterator;
};
