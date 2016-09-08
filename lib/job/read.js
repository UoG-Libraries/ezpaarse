'use strict';

const zlib  = require('zlib');
const iconv = require('iconv-lite');
const parse = require('co-busboy');
const is    = require('type-is');

const LinesProcessor = require('../lineprocessor.js');

const gzipTypes = new Set([
  'application/gzip',
  'application/x-gzip',
  'application/x-gunzip',
  'application/gzipped',
  'application/gzip-compressed',
  'application/x-compressed',
  'application/x-compress',
  'gzip/document'
]);

module.exports = function* read(req, res) {
  const self = this;

  this.logger.info('Starting response');

  req.on('close', () => { this._stop(); });

  const linesProcessor = new LinesProcessor(this);

  /**
   * Write ECs
   */
  linesProcessor.on('ec', ec => {
    if (!this.writerStarted) {
      this.writerStarted = true;
      res.status(200);
      this.writer.writeHead(this.outputFields);

      for (const prop in ec) {
        this.report.set('first_event', prop, ec[prop]);
      }
    }

    this.writer.write(ec);
    this.report.inc('general', 'nb-ecs');
  });

  /**
   * Write denied ECs
   */
  linesProcessor.on('denied', ec => {
    if (!this.deniedWriterStarted) {
      this.deniedWriterStarted = true;
      this.deniedWriter.writeHead(this.outputFields);
    }

    this.deniedWriter.write(ec);
    this.report.inc('general', 'nb-denied-ecs');
  });

  this.writer.on('saturated',       () => { this.addPressure('writer'); });
  this.deniedWriter.on('saturated', () => { this.addPressure('deniedWriter'); });
  this.logStreams.on('saturated',   () => { this.addPressure('loggers'); });
  linesProcessor.on('saturated',    () => { this.addPressure('lineprocessor'); });

  this.writer.on('drain',       () => { this.removePressure('writer'); });
  this.deniedWriter.on('drain', () => { this.removePressure('deniedWriter'); });
  this.logStreams.on('drain',   () => { this.removePressure('loggers'); });
  linesProcessor.on('drain',    () => { this.removePressure('lineprocessor'); });

  let needHeartbeat = true;

  // read input stream line by line
  this.splitter.on('data', line => {
    if (line) { linesProcessor.push(line); }

    // Regularly send dots to prevent the client from timing out
    if (this.resIsDeferred && needHeartbeat && this.parsedLines) {
      res.write('.');
      needHeartbeat = false;
      setTimeout(() => { needHeartbeat = true; }, 20000);
    }
  });

  let onSplitError;
  this.splitter.on('error', err => { onSplitError(err); });

  this.splitter.on('end', () => {
    this.logger.info('Request closed');
    linesProcessor.drain();
  });

  if (!is(req, ['multipart/form-data'])) {
    // handle a not multipart stream: log data are embeded directly in the HTTP body
    this.logger.info('Handling a raw stream upload');
    yield readStream(req);
    this.logger.info('Finished reading request');
    return drain();
  }

  this.logger.info('Handling a multipart upload');

  // to parse multipart data in the HTTP body, we use co-busboy
  const parts = parse(req, {
    autoFields: true,
    fileSize: Infinity
  });

  let nbFiles = 0;
  let part;
  while (part = yield parts) { // eslint-disable-line no-cond-assign
    this.report.set('files', ++nbFiles, part.filename || 'N/A');

    this.logger.info('Reading file [%s][%s]', part.filename || 'N/A', part.mimeType || 'N/A');
    yield readStream(part);
    this.logger.info('Finished reading file [%s]', part.filename);
  }

  this.logger.info('Finished reading multipart request');
  return drain();


  /**
   * Stop the splitter and wait for the line processor to drain
   * @return {Promise}
   */
  function drain() {
    return new Promise(resolve => {
      if (linesProcessor.ended) { return resolve(); }

      linesProcessor.on('end', resolve);
      self.splitter.end();
    });
  }

  /**
   * Read a stream and pipe it to the line splitter
   * Can be either a raw request or a file provided by busboy
   * @param  {Object} source  the stream to read
   * @return {Promise}
   */
  function readStream(source) {
    const headers         = source.headers || {};
    const contentType     = headers['content-type'] || source.mimeType || '';
    const contentEncoding = headers['content-encoding'] || '';
    const isGzip          = gzipTypes.has(contentType) || contentEncoding === 'gzip';

    return new Promise((resolve, reject) => {

      // only accepted encoding is gzip
      if (contentEncoding && contentEncoding != 'gzip') {
        return reject(self.error(4005, 406));
      }

      onSplitError = function (err) {
        reject(err.code === 'ENOBREAKS' ? self.error(4022, 400) : err);
      };

      let readStream = source;

      if (isGzip) {
        self.logger.info('Part detected as GZIP');

        const unzip = zlib.createUnzip();

        unzip.on('error', err => {
          uploadError(new Error(`Error while unziping request data: ${err}`), 4002, 400);
        });

        readStream = source.pipe(unzip);
      }

      const decodeStream = readStream.pipe(iconv.decodeStream(self.inputCharset));

      decodeStream.on('error', err => { uploadError(err, 4007); });
      decodeStream.on('end', () => {
        if (self.aborted) { return resolve(); }
        self.splitter.endOfFile(resolve);
      });

      decodeStream.pipe(self.splitter, { end: false });

      function uploadError(err, code, status) {
        self.logger.error('Upload error [%s]', err.message);
        err.code   = code;
        err.status = status;
        reject(err);
      }
    });
  }
};
