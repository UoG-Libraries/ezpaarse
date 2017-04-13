'use strict';

/* Directives */

angular.module('ezPAARSE.directives', [])
  .directive('bxslider', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        element.bxSlider({
          mode: 'fade',
          captions: true,
          auto: true,
          adaptiveHeight: true
        });
      }
    };
  })
  .directive('ezGetCurl', function ($location, requestService, inputService, settingService) {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        scope.getCurl = function () {
          var headers = settingService.getHeaders();
          var curl    = 'curl -v -X POST ';
          curl += $location.protocol() + '://';
          curl += $location.host() + ':';
          curl += $location.port();

          for (var key in headers) {
            if (headers[key]) {
              curl += ' \\\n -H "' + key + ':' + headers[key].replace(/"/g, '\\"') + '"';
            }
          }

          inputService.files.forEach(function (file) {
            curl += ' \\\n -F "files[]=@' + file.name + (file.type ? ';type=' + file.type : '') + '"';
          });


          scope.curl = curl;
          element.modal('show');
        };
      }
    };
  })
  .directive('popup', function () {
    return {
      restrict: 'AE',
      link: function (scope, element, attributes) {
        attributes.$observe('popup', function (newVal) {
          element.popup({ html: newVal });
        });
      }
    };
  })
  .directive('ezPulse', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        element.click(function () {
          if (!attributes.hasOwnProperty('ezPulseIf') || scope.$eval(attributes['ezPulseIf'])) {
            $(attributes['ezPulse']).transition('pulse');
          }
        });
      }
    };
  })
  .directive('ezToggleSidebar', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        element.click(function () {
          $(attributes['ezToggleSidebar']).sidebar('toggle');
        });
      }
    };
  })
  .directive('ezToggleModal', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        element.click(function () {
          $(attributes['ezToggleModal']).modal('toggle');
        });
      }
    };
  })
  .directive('sidebar', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.sidebar({ context: attributes.context });
      }
    };
  })
  .directive('modal', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.modal({ allowMultiple: false });
      }
    };
  })
  .directive('ezTriggerClick', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        $(element).click(function () {
          $(attributes['ezTriggerClick']).click();
        });
      }
    };
  })
  .directive('ezFileDrop', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        var elem   = $(element);
        var fn     = attributes['ezFileDrop'];
        var dimmer = elem.find('.ui.dimmer');

        var preventDefault = function (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        var dimmed = function () {
          elem.addClass('over');
          dimmer.addClass('active');
        }
        var undimmed = function () {
          elem.removeClass('over');
          dimmer.removeClass('active');
        }

        elem.on('dragenter', function (e) {
          preventDefault(e);
          dimmed();
        });
        dimmer.on('dragover', function (e) {
          preventDefault(e);
        });
        dimmer.on('dragleave', function (e) {
          preventDefault(e);
          undimmed();
        });
        dimmer.on('drop', function (e) {
          preventDefault(e);
          undimmed();

          var files = e.originalEvent.dataTransfer.files;
          if (typeof scope[fn] == 'function') { scope[fn].call(this, files); }
        });
      }
    };
  })
  .directive('form', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.submit(function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    };
  })
  .directive('accordion', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.accordion();
      }
    };
  })
  .directive('ezCheckbox', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.checkbox();
      }
    };
  });
