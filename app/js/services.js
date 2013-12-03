'use strict';

angular.module('vitral', ['ngResource'], function($provide) {
  $provide.factory('ImageService', function() {

    var ImageList = $resource('https://www.photorank.me/api/v1/photos/?api_key=0a40a13fd9d531110b4d6515ef0d6c529acdb59e81194132356a1b8903790c18',
    {
        limit:30,
        offset:0,
    }, 
    {
     charge: { method:'GET', params:{charge:true}}
    });
    
    return ImageList;

  });
});