'use strict';

// Declare app level module which depends on filters, and services
var module = angular.module('vitral', ['vitral.services','ngRoute']);

module.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'vitralController'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'vitralController'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

module.controller('vitralController', ['$scope','$http','appConfig', function ($scope, $http, appConfig) {
    
    var imageList = [];
    var offset = 0;
    var limit = appConfig.page_limit;
    
    $scope.init = function(){        
    };

//	$scope.hideImages = function(){
//		  $(".element-inner").hide(500);
//	}
    
    $scope.nextPage = function()
    {
		//this.hideImages();
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

    $scope.goToRelativePage = function(relativePageNumber)
    {
       offset = relativePageNumber * limit;
       this.loadImages();    
    };       
    
    $scope.loadImages = function()
    {
		imageList = [];
        $http.get(appConfig.photorankUrl, { 
            params: {
                api_key:appConfig.photorankKey,
                limit:limit,
                offset:offset
            }
        }).
        success(function(data, status, headers, config) {
            if(status===200){
                
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

			for(var i=0; i<limit;i++){
				imageList.push({
                    image_url:'img/error.jpg', 
                    image_label:"?"
                });
			}
			
			preload('img/error.jpg');
			$scope.imageList = imageList;
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
       templateUrl: function (tElement, tAttrs) {
            if (tAttrs.theme) {
				switch(tAttrs.theme){
					case "rombo":
						return 'partials/ng-mock.html';
					case "cubik":
						return 'partials/ng-cubik-mock.html';
					default:
						return 'partials/ng-cubik-mock.html';
				}
            } else {
				return 'partials/ng-cubik-mock.html';
			}
       },
       link: function(scope, element, attrs, ngModel) {
        
                var backCoolColors =  ['#E8D0A9','#B7AFA3','#C1DAD6','#F5FAFA','',
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

.directive('ngVitralpagination', ['appConfig',function(appConfig) {
    return {
       restrict: 'A',
       transclude: true,
       templateUrl: 'partials/ng-pagination.html',
       link: function(scope, element, attrs) {
			element.bind('click', function() {
			});
       }
     };
  }])

.directive('ngImageload',['$animate', function($animate) {
	return {
        restrict: 'A',
        link: function(scope, element, attrs) {

/*
				scope.$watch('imageList', function(oldVal, newVal){
					if(newVal!==undefined && oldVal!==undefined){
						console.log("oldVal:");		
						console.log(oldVal);
						console.log("newVal:");
						console.log(newVal);
					}
				});
*/
            element.bind('load', function() {
				// Hide loading icon:
				var imgContainer =  $(element).parent().parent('.element-inner');
				imgContainer.children('.img-loading-wrapper').remove();
				imgContainer.children('.element-img').removeClass('element-hidden');
				
				// Show and animate all the images:
				$animate.removeClass(imgContainer, 'element-hidden');
				$animate.addClass(imgContainer, 'element-spin-and-show');

				// Show the element:
				// imgContainer.find('.loading').addClass('element-hidden');
   
				//var imgContainer =  $(element).parent('.element-inner');
				//imgContainer.find('.loading').addClass('element-hidden');
                
            });
        }
    };
}]);

