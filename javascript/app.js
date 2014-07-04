angular.module("Todo", ["zacbarton.directives"])
	.config(function($locationProvider) {
		$locationProvider.html5Mode(true);
	})
	.controller("Test", function($scope, $location, $timeout) {
		$scope.view = "active";
		$scope.input = "";
		$scope.items = [];
		$scope.done = {done: false};
		$scope.icon = "add";
		
		$scope.add = function() {
			if ($scope.input === "") return;
			
			$scope.icon = "check";
			$timeout(function() {
				$scope.icon = "add";
			}, 1000);
			
			$scope.items.unshift({done: false, text: $scope.input, timestamp: Date.now()});
			$scope.input = "";
		};
		
		// watch for url changes from polymer
		$scope.$watch(function(){ return $location.hash(); }, function(value) {
			$scope.view = value;
		});
	});