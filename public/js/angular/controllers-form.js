'use strict';

/* Controllers of the form page */

angular.module('ezPAARSE.form-controllers', [])
  .controller('FormCtrl', function ($scope, $location, settingService, requestService, inputService) {
    if (requestService.data.state == 'loading') {
      $location.path('/process');
    }

    $scope.files     = [];
    $scope.totalSize = 0;
    $scope.showHelp  = false;
    $scope.inputType = $location.search().tab || 'files';
    $scope.ss        = settingService;
    $scope.inputs    = inputService;

    $scope.$watch('ss.settings', function () {
      settingService.saveSettings();
      settingService.control();
    }, true);

    $scope.toggleHelp = function ()     { $scope.showHelp  = !$scope.showHelp; };
    $scope.selectTab  = function (type) {
      $scope.inputType = type;
      $location.search('tab', type);
    };

    $scope.addCryptedField = function () {
      if ($scope.cryptedField) {
        settingService.addCryptedField($scope.cryptedField);
        $scope.cryptedField = '';
      }
    };
    $scope.addOutputField = function (type) {
      var input = (type == 'plus') ? 'plusField' : 'minusField';

      if ($scope[input]) {
        settingService.addOutputField($scope[input], type);
        $scope[input] = '';
      }
    };

    var updateTotalSize = function () {
      $scope.totalSize = 0;
      for (var i = 0, l = $scope.files.length; i < l; i++) {
        $scope.totalSize += $scope.files[i].size;
      }
    };

    $scope.addFiles = function (files) {
      if (!files) { return; }

      $scope.$apply(function () {
        for (var i = 0, l = files.length; i < l; i++) {
          inputService.addFile(files[i]);
        }
      });
    };

    $scope.selectFiles = function (fileInput) {
      var input = $(fileInput);
      var files = input.prop('files') || [];
      $scope.addFiles(files);
      input.val('');
    };

    $scope.start = function () {
      var input;

      switch ($scope.inputType) {
      case 'text':
        if (!inputService.text) { return; }
        input = inputService.text;
        break;
      case 'files':
        if (inputService.files.length === 0) { return; }
        input = inputService.files;
        break;
      default:
        return;
      }

      requestService.send(input, settingService.getHeaders());

      $location.path('/process');
    };
  }).controller('FormatCtrl', function ($scope, settingService, inputService, $timeout) {
    var logParser = require('logparser');
    var settings  = settingService.settings;
    var promise;
    $scope.test = {
      loading: false,
      tab: 'format'
    };

    $scope.parse = function () {
      $timeout.cancel(promise);

      var logLine     = inputService.text.split('\n')[0];
      var format      = settings.logFormat || '';
      var fullFormat  = format;
      var strictMatch = true;
      var regexp;
      var regexpBreak;

      if (!logLine) { return $scope.test.result = null; }

      $scope.test.loading = true;

      (function retry() {
        var parser = logParser({
          proxy: format ? settings.proxyType : null,
          format: format,
          dateFormat: settings.headers['Date-Format'],
          forceParser: settings.headers['Force-Parser'],
          laxist: !strictMatch
        });

        var ec = parser.parse(logLine);

        if (strictMatch && parser.getRegexp()) {
          regexp = parser.getRegexp().source;

          for (regexpBreak = regexp.length; regexpBreak >= 0; regexpBreak--) {
            try {
              var reg = new RegExp(regexp.substr(0, regexpBreak));
            } catch (e) { continue; }

            if (reg.test(logLine)) { break; }
          }
        }

        if (ec) {
          $scope.test.loading = false;

          var missing = [];
          if (!ec.hasOwnProperty('timestamp')) { missing.push('date'); }
          if (!ec.hasOwnProperty('url'))       { missing.push('url'); }
          if (!ec.hasOwnProperty('domain'))    { missing.push('domain'); }

          return $scope.test.result = {
            autoDetect:  parser.autoDetect(),
            strictMatch: strictMatch,
            proxy:       parser.getProxy(),
            format:      parser.autoDetect() ? parser.getFormat() : fullFormat,
            formatBreak: parser.autoDetect() ? parser.getFormat().length : format.length,
            regexp:      regexp,
            regexpBreak: regexpBreak,
            missing:     missing,
            ec:          ec
          };
        }

        if (!strictMatch) { format = format.substr(0, format.length - 1); }
        strictMatch = false;

        if (format) {
          promise = $timeout(retry);
        } else {
          $scope.test.loading = false;
          $scope.test.result  = {
            autoDetect:  parser.autoDetect(),
            proxy:       parser.getProxy(),
            strictMatch: false,
            regexp:      regexp,
            regexpBreak: regexpBreak,
            format:      parser.autoDetect() ? parser.getFormat() : fullFormat,
            formatBreak: 0
          };
        }
      })();
    };

    if (inputService.text) { $scope.parse(); }
  });
