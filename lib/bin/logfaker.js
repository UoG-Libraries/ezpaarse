/*eslint max-len: 0*/
'use strict';

/**
 * Command used to generate random log
 */

exports.logFaker = function () {

  var logF = require('../logfaker.js');

  // get the command line argument
  // platform
  var yargs = require('yargs')
      .usage('Usage: $0 --platform=[string] --nb=[num] --rate=[num] --duration=[seconds]\nExample: $0 --platform="sd|npg" --rate=100 --duration=10')
      .demand('platform').default('platform', '-')
      .demand('nb').alias('nb', 'n').default('nb', 'nolimit')
      .demand('rate').alias('rate', 'r').default('rate', 10)
      .demand('duration').alias('duration', 'd').default('duration', 'nolimit')
      .describe('platform', 'the publisher platform code used as a source for generating url')
      .describe('nb', 'number of lines of log to generate')
      .describe('rate', 'number of lines of log to generate per second (max 1000)')
      .describe('duration', 'stop log generation after a specific number of seconds');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  // get the platforms list from the script parameter or from the platforms folders
  var platforms = [];
  var params = {};

  if (argv.platform !== '-') {
    platforms = argv.platform.split('|');
    params.platforms = platforms;
  }

  params.nb = argv.nb;
  params.rate = argv.rate;
  params.duration = argv.duration;

  logF.logFaker(params, function (s) {

    var stream = s.pipe(process.stdout);
    stream.on('end', function () {
      process.exit(0);
    });
  });
};