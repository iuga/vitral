'use strict';

var module = angular.module('vitral', ['vitral.services']);

module.controller('vitralController', ['$scope','$http','appConfig', function ($scope, $http, appConfig) {
    
    var imageList = Array();
    var offset = 0;
    var limit = appConfig.page_limit;
    
    $scope.init = function(){        
        
    };
    
    $scope.nextPage = function()
    {
       offset = offset + limit;
       this.loadImages();
    }; 
    
    $scope.previousPage = function()
    {
       var lower_limit = offset - limit;
       if(lower_limit<0){
           offset = 0;
       }else{
           offset = offset - limit;
       }
       
       this.loadImages();
    };        
    
    $scope.loadImages = function()
    {
        $http.get(appConfig.photorankUrl, { 
            params: {
                api_key:appConfig.photorankKey,
                limit:limit,
                offset:offset
            }
        }).
        success(function(data, status, headers, config) {
            if(status===200){
                imageList = { highlighted: Array(), images: Array()};
                var key;
                for(key in data.response){
                     imageList.images.push({image_url:data.response[key].normal_image, image_label:data.response[key].cleanCaption});
                     preload(data.response[key].normal_image);
                }
                $scope.imageBundle = imageList;
            }
        }).
        error(function(data, status, headers, config) {
            //TODO: Show a message
            console.log("Error retriving data"+status);
        });
    };    
    
    function preload(image_url){
        $('<img/>')[0].src = image_url;
    }
    
    $scope.init();
    $scope.loadImages();
    
}])

.directive('vitralGallery', ['appConfig', function(appConfig) {
    return function(scope, elm, attrs) {
        console.log(attrs);
        elm.text(appConfig.photorankUrl);
    };
  }]);;