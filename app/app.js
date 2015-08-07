(function(angular){
	'use strict';
	
	angular.module('mapApp', ['geolocation'])
	.constant('asyncUrl', 'https://maps.googleapis.com/maps/api/js?callback=')
	.factory('googleMapService', googleMapService)
	.controller('mapController', mapController);
	
	function googleMapService($window, $q, asyncUrl){
		//var asyncUrl = 'https://maps.googleapis.com/maps/api/js?callback=',
        var mapsDefer = $q.defer();
		
		$window.googleMapsInitialized = mapsDefer.resolve; 

	    var asyncLoad = function(asyncUrl, callbackName) {
	      var script = document.createElement('script');
		  
	      script.src = asyncUrl + callbackName;
	      document.body.appendChild(script);
	    };
	    //Start loading google maps
	    asyncLoad(asyncUrl, 'googleMapsInitialized');
	
	    //Usage: Initializer.mapsInitialized.then(callback)
	    return {
	        mapsInitialized : mapsDefer.promise
	    };
	}
	
	function mapController($window, geolocation, googleMapService){
		var vm = this;
		
		var mapOptions = {
			center: { lat: -34.397, lng: 150.644},
          	zoom: 8	
		};
		
		angular.extend(vm, {
			map:undefined,
			mapOptions:mapOptions,
			element:document.getElementById('map-canvas')
		});
		
		activate();
		
		function activate(){
			geolocation.getLocation().then(function(position){
				console.log('current location', position);
				vm.mapOptions.center = {
					lat:position.coords.latitude,
					lng:position.coords.longitude	
				};
			}, function(error){
				console.log(error);
			}).then(function(){
				googleMapService.mapsInitialized.then(function(){
				vm.map = new google.maps.Map(vm.element,
					 vm.mapOptions);
			}, function(error){
				console.error(error);
			});
			});
		}
	}
	
})(window.angular);