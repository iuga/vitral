'use strict';

var module = angular.module('vitral', ['vitral.services','ngRoute']);

module.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'vitralController'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'vitralController'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

module.controller('vitralController', ['$scope','$http','appConfig','$animate', function ($scope, $http, appConfig, $animate) {
    
    var imageList = [];
    var offset = 0;
    var limit = appConfig.page_limit;

    $scope.init = function(){        
    };

    $scope.nextPage = function()
    {
        offset = offset + limit;
		$scope.changeImages();
    }; 
    
    $scope.previousPage = function()
    {
       var lower_limit = offset - limit;
       if(lower_limit<0){
           offset = 0;
       }else{
			offset = offset - limit;
			$scope.changeImages();
       }
	   
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
			$scope.imageList = imageList;
        });
    };

	$scope.changeImages = function(){
		var allImages = $('.img-vitral');
		allImages.removeClass('element-fadein-show');
		$.when(
			$(allImages).each(function( index ) {
                $(this).parent().parent('.element-inner').children('.img-loading-wrapper').show()
                $(this).delay( 50 * (index+1)).addClass('element-fadeout').hide(200);
			})
		).done(function() {
			$scope.loadImages();
		});
	};
    
    $scope.init();
    
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
        
                var backCoolColors =  ['#E8D0A9','#B7AFA3','#C1DAD6','#F5FAFA','#C1DAD6',
                                       '#6D929B','#E8D0A9','#B7AFA3','#C1DAD6','#F5FAFA',
                                       '#ACD1E9','#6D929B','#E8D0A9','#B7AFA3','#C1DAD6'];

                $.when($(".element-inner").each(function( index ) {
                     $(this).hide()
                            .delay( 75 * (index+1) )
                            .css('background-color',backCoolColors[index])
                            .removeClass('element-hidden')
                            .addClass("element-spin-and-show")
                            .show(400);                
                })).done(function() {
					scope.loadImages();
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
		transclude: true,

        link: function(scope, element, attrs) {

			element.bind('load', function() {

				$(element).show();
				$animate.removeClass(element, 'element-fadeout');

				var imgContainer =  $(element).parent().parent('.element-inner');

				// Remove loading icon...
				imgContainer.children('.img-loading-wrapper').hide();
				imgContainer.children('.element-img').removeClass('element-hidden');

				// Show the image:
				if(imgContainer.hasClass("element-hidden")){
					$animate.removeClass(imgContainer, 'element-hidden');
				}

				// Show the image:
				$animate.addClass(element, 'element-fadein-show');
						
            });

        }
    };
}]);

