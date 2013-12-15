'use strict';

var module = angular.module('vitral', ['vitral.services']);

module.controller('vitralController', ['$scope','$http','appConfig', function ($scope, $http, appConfig) {
    
    var imageList = [];
    var offset = 3;
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
                imageList = [];
                
                angular.forEach(data.response, function(value){
                    imageList.push({
                        image_url:value.normal_image, 
                        image_label:value.cleanCaption
                    });
                    preload(value.normal_image);
                });

                $scope.imageList = imageList;
            }
        }).
        error(function(data, status, headers, config) {
            console.log("Error retriving data"+status);
        });
    };    
    
    function preload(image_url){
        $('<img/>')[0].src = image_url;
    }
    
    $scope.init();
    $scope.loadImages();
    
}])

.directive('ngVitralgallery', ['appConfig','$animate', function(appConfig, $animate) {
    return {
       restrict: 'A',
       transclude: true,
       templateUrl: 'partials/ng-mock.html',
       link: function(scope, element, attrs, ngModel) {
        
                var backCoolColors =  ['#E8D0A9','#B7AFA3','#C1DAD6','#F5FAFA','#ACD1E9',
                                       '#6D929B','#E8D0A9','#B7AFA3','#C1DAD6','#F5FAFA',
                                       '#ACD1E9','#6D929B','#E8D0A9','#B7AFA3','#C1DAD6'];

                $(".element-inner").each(function( index ) {
                     $(this).hide()
                            .delay( 300 * (index+1) )
                            .css('background-color',backCoolColors[index])
                            .removeClass('element-hidden')
                            .addClass("element-spin-and-show")
                            .show(400);                
                });
                
       }
     };
  }])

.directive('ngImageload',['$animate', function($animate) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                
				var imgContainer =  $(element).parent('.element-inner');
				imgContainer.find('.loading').addClass('element-hidden');
                
            });
        }
    };
}]);

