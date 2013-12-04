'use strict';

var module = angular.module('vitral.services', []);

module.factory('appConfig',function(){
    return {
        photorankUrl: 'https://www.photorank.me/api/v1/photos/',
        photorankKey: '0a40a13fd9d531110b4d6515ef0d6c529acdb59e81194132356a1b8903790c18',
        page_limit : 15,
    };
});