'use strict';


// Declare app level module which depends on filters, and services
angular.module('vitral', [
  'ngRoute',
  'vitral.filters',
  'vitral.services',
  'vitral.directives',
  'vitral.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'ImageVitralController'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'ImageVitralController'});
  $routeProvider.otherwise({redirectTo: '/ImageVitralController'});
}]);