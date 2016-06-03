/*eslint global-require: 0*/
'use strict';
var config        = require('../config.js');
var prefixexsit =  false;
var prefixLogin  = '';
// test id file prefix login exist
try {
  prefixLogin = require('../../' + config.PREFIX_LOGIN);
  prefixexsit =  true;
} catch (e) {
  prefixexsit =  false;
}
/**
 * cut fields login
 * @param  {Object}   req   the request stream
 * @param  {Object}   res   the response stream
 * @param  {Object}   job   the job being initialized
 */
module.exports = function (req, res, job) {
  var activated = (req.header('cut') || '').toLowerCase() === 'true';
  var fieldscut = req.header('fieldscut') || '';
  var exp_reg_fields = req.header('exp_reg_fields') || '';
  var fields_creat = req.header('fields_creat') || '';
  if (!activated) { return function (ec, next) { next(); }; }

  // return function has a work to cut fields login and create new fields with result cutting
  return function cut(ec, next) {
    if (ec) {
      // check if file prefix exist
      if (ec.login) {
        if (prefixexsit) {
          var prefix = '';
          for (var i = 0; i< ec['login'].length; i++) {
            prefix = prefix + ec['login'].substr(i, 1);
            if (prefixLogin[prefix.toUpperCase()] === prefix) {
              ec['OU'] = ec['login'].substr(i+1, ec['login'].length);
              break;
            }
          }
        }
        // check if login is a mail regulèrie  expression
        if (/([\w\W]+)@([\w\W]+)/.test(ec['login'])) {
          ec['OU'] = ec['login'];
        }
      }

      // cutting fields defined in header with a regex and put a value in new fields
      if (fieldscut && exp_reg_fields && fields_creat) {
        var regfields = new RegExp(exp_reg_fields);
        var match = '';
        if (ec[fieldscut]) {
          if ((match = regfields.exec(ec[fieldscut])) !== null) {
            var fields = fields_creat.split(',');
            for (var j = 0; j < fields.length; j++) {
              ec[fields[j]] = match[j + 1];
            }
          }
        }
      }
    }

    next();
  };
};