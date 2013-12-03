'use strict';

var VitralModule = angular.module('vitral', []);

VitralModule.controller('ImageVitralController', function ($scope, $http) {
    
    var imageBundle;
    var imageList;
    var offset;
    var limit;
    
    var test = "Hola Mundo!";
    
    $scope.init = function(){
        
        imageBundle = { highlighted: Array(), images: Array() };
        
        imageList = new Array();
        offset = 0;
        limit = 15;
        $scope.imageList = imageList;
        $scope.loadImages();
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
        $http.get('https://www.photorank.me/api/v1/photos/',
        { 
            params: 
            {
                api_key:'0a40a13fd9d531110b4d6515ef0d6c529acdb59e81194132356a1b8903790c18',
                limit:limit,
                offset:offset
            }
        }
        ).
        success(function(data, status, headers, config) {
            if(status===200){
                imageList = new Array();
                imageBundle.highlighted = new Array();
                imageBundle.images = new Array();
                var key;
                for(key in data.response){
                     console.log(data.response[key].normal_image+' - '+data.response[key].cleanCaption);
                     
                     imageList.push({image_url:data.response[key].normal_image, image_label:data.response[key].cleanCaption});
                     
                     if(key==="0" || key==="1" || key==="2"){
                         imageBundle.highlighted.push({image_url:data.response[key].normal_image, image_label:data.response[key].cleanCaption});
                     }else{
                         imageBundle.images.push({image_url:data.response[key].normal_image, image_label:data.response[key].cleanCaption});
                     }
                    
                     preload(data.response[key].normal_image);
                }
                $scope.imageList = imageList;
                $scope.imageBundle = imageBundle;
            }
        }).
        error(function(data, status, headers, config) {
            imageList = [ {message:'Error'}];
        });
    };    
    
    function preload(image_url){
        $('<img/>')[0].src = image_url;
    }
    
    $scope.init();
    
});