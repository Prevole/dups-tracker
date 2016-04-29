var
  fs = require('fs-extra'),
  path = require('path'),
  _ = require('underscore'),
  md5 = require('md5-file'),
  colors = require('colors')
;

if (!process.argv[2]) {
  console.log('You should specify at least one root folder.'.red);
  process.exit(-1);
}

var rootDirectories = {
  dirs: process.argv.slice(2),
  current: 0
};

_.extend(rootDirectories, {
  hasNext: function() {
    return this.current < this.dirs.length;
  },

  next: function() {
    return this.dirs[this.current++];
  }
});

var filesByName = {};
var filesByMd5 = {};

walk();

function walk() {
  fs.walk(rootDirectories.next())
    .on('data', function(pathItem) {
      if (pathItem.stats.isDirectory()) {
        process.stdout.write('.'.cyan);
      }

      if (pathItem.stats.isFile()) {
        pathItem.fileName = pathItem.path.replace(/.*\//, '');
        pathItem.md5 = md5(pathItem.path);


        if (_.isUndefined(filesByName[pathItem.fileName])) {
          filesByName[pathItem.fileName] = [];
        }

        filesByName[pathItem.fileName].push(pathItem);

        if (_.isUndefined(filesByMd5[pathItem.md5])) {
          filesByMd5[pathItem.md5] = [];
        }

        filesByMd5[pathItem.md5].push(pathItem);
      }
    })
    .on('end', function() {
      if (rootDirectories.hasNext()) {
        walk();
      }
      else {
        print();
      }
    });
}

function print() {
  console.log('\n\n');
  console.log('Comparison by simple names:'.green);
  _.each(filesByName, function(fileByName, key) {
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
  _.each(filesByMd5, function(fileByMd5, key) {
    if (fileByMd5.length > 1) {
      console.log(('  It seems there is a duplicated file for md5: ' + key).yellow);
      _.each(fileByMd5, function(file) {
        console.log('    ' + file.path.blue + (' (md5: ' + file.md5 + ')').magenta);
      });
      console.log('');
    }
  });
}
