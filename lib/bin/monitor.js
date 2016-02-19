/*eslint max-len: 0*/
'use strict';

/**
 * Command used to monitor a pid tree
 * - cpu
 * - mem
 * - disk
 */

exports.monitor = function () {

  var shell  = require('shelljs');
  var Lazy = require('lazy');

  // get the command line argument
  // pid
  // wait
  var yargs = require('yargs')
      .usage('Usage: $0 --pid=[num] --each=[num] --duration=[num]')
      .demand('pid')
      .demand('each').default('each', 2)
      .demand('duration').default('duration', 'nolimit')
      .check(function (argv) {
        return !isNaN(Number(argv.pid)) &&
              !isNaN(Number(argv.each)) &&
              (argv.duration == 'nolimit' || !isNaN(Number(argv.duration)));
      })
      .describe('pid', 'the pid of the process tree to monitor')
      .describe('each', 'number of seconds to wait before each probing')
      .describe('duration', 'monitoring duration in seconds');
  var argv = yargs.argv;

  // show usage if --help option is used
  if (argv.help) {
    yargs.showHelp();
    process.exit(0);
  }

  // read stdin line by line and count number of line received
  var monitor = true;
  var nb_input_line = 0;
  var last_nb_input_line = 0;
  //process.stdin.resume();
  //var inputstream = byline(process.stdin);
  new Lazy(process.stdin)
    .lines
    .map(String)
    .map(function () {
      nb_input_line++;
    });
  process.stdin.on('end', function () {
    monitor = false;
  });

  // write csv head line
  var fields = [ 'time', 'nbpid', 'cpu', 'mem_vsz', 'mem_rss', 'disk_read', 'disk_write', 'nb_input_line', 'input_line_delta' ];
  fields.forEach(function (field, index) {
    process.stdout.write('"');
    process.stdout.write(field);
    process.stdout.write('"');
    process.stdout.write((index <= fields.length - 2) ? ',' : '\n');
  });

  function monitor_pids() {
    var pids = get_pids();
    // -d for disk stats
    // -r for memory stats
    // -u for cpu stats
    // -h for all on one line (but do not display average)
    // 1 1 means check each second during 1 second
    shell.exec('pidstat -h -d -u -r -p ' + pids.join(',') + ' 1 1', {silent: true, async: true}, function (code, output) {

      var record = { pid: [],
                    cpu: 0,
                    time: 0,
                    mem_vsz: 0,
                    mem_rss: 0,
                    disk_read: 0,
                    disk_write: 0,
                    nb_input_line: nb_input_line,
                    input_line_delta: (nb_input_line - last_nb_input_line) / argv.each };

      // update the (last) input line marker
      last_nb_input_line = nb_input_line;

      // parse the results
      output.split('\n').forEach(function (line) {
        // cleanup the line
        line = line.trim();
        if (line === '') {
          return;
        }

        // fill the record
        if (line.match(/^[0-9]/)) {
          var fields = line.split(/ +/);
          record.time        = parseInt(fields[0], 10) - start_timestamp;
          record.pid.push(parseInt(fields[1], 10));
          record.cpu        += parseFloat(fields[5].replace(',', '.'));
          record.mem_vsz    += parseInt(fields[9], 10) / 1024 / 1024;
          record.mem_rss    += parseInt(fields[10], 10) / 1024 / 1024;
          record.disk_read  += parseFloat(fields[12].replace(',', '.') * 1000);
          record.disk_write += parseFloat(fields[13].replace(',', '.') * 1000);
        }

      });

      // write monitoring record as a csv line
      fields.forEach(function (field, index) {
        if (field == 'nbpid') {
          process.stdout.write(record.pid.length.toString());
        } else if (field == 'cpu' || field == 'mem_vsz' || field == 'mem_rss') {
          process.stdout.write(record[field].toFixed(2).toString());
        } else {
          process.stdout.write(record[field].toString());
        }
        process.stdout.write((index <= fields.length - 2) ? ',' : '\n');
      });

    });

    if (monitor) {
      setTimeout(monitor_pids, argv.each * 1000); // monitoring each N seconds
    } else {
      process.exit(0);
    }
  }

  function get_pids() {
    var pids = [];
    shell.exec('pstree -p ' + argv.pid, {silent: true}).output.split(/(\([0-9]+\))/).forEach(function (elt) {
      if (elt.match(/\([0-9]+\)/)) {
        pids.push(elt.slice(1, -1));
      }
    });
    return pids;
  }

  // start process monitoring (after 10 miliseconds)
  var start_timestamp = Math.floor(new Date().getTime() / 1000);
  setTimeout(monitor_pids, 10);

  // stop monitoring after the duration is expired
  if (argv.duration != 'nolimit') {
    setTimeout(function () {
      // if data are received through stdin, wait for stream end
      // instead of waiting for duration parameter
      if (nb_input_line > 0) {
        monitor = false;
      }
    }, argv.duration * 1000);
  }
};