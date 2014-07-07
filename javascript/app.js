angular.module("Demo", ["ngStorage", "zacbarton.bindPolymer"])
	.config(function($locationProvider) {
		$locationProvider.html5Mode(true);
	})
	.run(function($rootScope, $location) {
		// watch for polymer url changes
		$rootScope.$watch(function(){ return $location.hash(); }, function(value) {
			$rootScope.view = value;
		});
	})
	.controller("Todo", function($scope, $timeout, $sessionStorage) {
		$scope.storage = $sessionStorage.$default({
			items: []
		});
		
		$scope.input = "";
		$scope.icon = "add";
		$scope.items = $scope.storage.items;
		
		$scope.add = function() {
			if ($scope.input === "") {
				return;
			}
			
			$scope.icon = "check";
			$timeout(function() {
				$scope.icon = "add";
			}, 750);
			
			$scope.storage.items.unshift({done: false, text: $scope.input, timestamp: Date.now()});
			$scope.input = "";
		};
		
		$scope.edit = function(item, active) {
			item.edit = active;
		};
		
		$scope.remove = function(item) {
			$scope.storage.items.splice($scope.storage.items.indexOf(item), 1);
		};
	});