'use strict';

angular.module('vitral.directives', ['vitral.services']).
  directive('vitralGallery', ['appConfig', function(appConfig) {
    return function(scope, elm, attrs) {
        console.log(attrs);
        elm.text(appConfig.photorankUrl);
    };
  }]);
