var
  directoryIterator = require('./lib/directoryIterator'),
  walker = require('./lib/walker'),
  reporters = require('./lib/reporters/reporters'),
  colors = require('colors'),
  yargs = require('yargs'),
  _ = require('underscore')
;

/**
 * Define the command line arguments
 */
var argv = yargs
  .usage('Usage: $0 [options] directory [directories]')
  .demand(1, 'At least one directory must be specified'.red)
  .boolean('c')
  .default({
    c: true
  })
  .alias('c', 'console')
  .describe('c', 'Use the console reporter')
  .boolean('t')
  .alias('t', 'html')
  .describe('t', 'Use the html reporter')
  .alias('o', 'out')
  .describe('o', 'HTML output file when -t is used')
  .requiresArg('o')
  .implies('t', 'o')
  .describe('e', 'Exclude files following a minimatch pattern (https://github.com/isaacs/minimatch)')
  .alias('e', 'exclude')
  .example('$0 -c -t html tmp/a tmp/b tmp/c', 'Use console and html reporters to check the duplicates of directories a, b and c in tmp')
  .example('$0 -e "**/.DS_Store" tmp/a tmp/b', 'Use console reporter to check the duplicates of directories a and b in tmp. It will excludes the .DS_Store files in all directories.')
  .help('h')
  .alias('h', 'help')
  .wrap(null)
  .version(function() {
    return 'v' + require('./package.json').version;
  })
  .argv
;

// reporters
var reportersToUse = [];

// Check if console reporter is asked
if (argv.c) {
  reportersToUse.push({ name: 'console' });
}

// Check if html reporter is asked
if (argv.t) {
  reportersToUse.push({ name: 'html', options: { out: argv.o }});
}

/**
 * The configuration to run the app
 *
 * @type {{directoryIterator: {directories: *, current: number}, reporters: *}}
 */
var config = {
  directoryIterator: directoryIterator(argv._),
  reporters: reportersToUse
};

/**
 * Add the excludes if necessary
 */
if (argv.e) {
  config.excludes = _.isArray(argv.e) ? argv.e : [ argv.e ];
}

/**
 * Process the duplication lookup
 */
walker(config).walk()
  .then(function(results) {
    // Call each reporter
    _.each(config.reporters, function(reporter) {
      reporters[reporter.name](results, _.extend({}, reporter.options));
    });
  })
;

