'use strict';

//
// Command used to extract config value from config.json
//

exports.readConfig = function () {
  var config = require('../config.js');
  var pkg    = require('../../package.json');


  // get the command line argument
  // platform
  var yargs = require('yargs')
      .usage('Usage: $0 --key=[string]')
      .demand('key').alias('key', 'k')
      .describe('key', 'the config key to show (ex: EZPAARSE_NODEJS_PORT)');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  // read  config.json content filterd by --key
  if (config[argv.key] !== undefined) {
    if (config[argv.key] instanceof Array) {
      process.stdout.write(config[argv.key].join('\n'));
      process.exit(0);
    } else {
      process.stdout.write(config[argv.key].toString());
      process.exit(0);
    }
  } else {
    // search into package.json
    if (pkg[argv.key] !== undefined) {
      if (pkg[argv.key] instanceof Object) {
        process.stderr.write('key not handled: ' + argv.key + '\n');
        process.exit(1);
      } else {
        process.stdout.write(pkg[argv.key].toString());
        process.exit(0);
      }
    } else {
      process.stderr.write('Unknown key: ' + argv.key + '\n');
      process.exit(1);
    }
  }
};