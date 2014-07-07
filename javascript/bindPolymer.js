angular.module("zacbarton.bindPolymer", []).directive("bindPolymer", function($timeout) {
	var debug = false;
	var polymerReady = false;
	
	document.addEventListener("polymer-ready", function() {
		polymerReady = true;
	});
	
	return {
		require: "ngModel"
		, restrict: "A"
		, link: function link(scope, element, attrs, ngModel) {
			if (!ngModel)
				return;
			
			if (!polymerReady) {
				return $timeout(function() {
					link(scope, element, attrs, ngModel);
				}, 100);
			}
			
			switch (element[0].nodeName) {
				case "PAPER-INPUT":
					bindAngularAndPolymer("inputValue");
					
					// not sure why we really need to do this?!?
					element.on("keydown", function(event) {
						switch (event.keyCode) {
							case 13: // return
								if (ngModel.$invalid) return;
								
								$timeout(function() {
									var action = getForm(element).attr("ng-submit");
									scope.$eval(action);
								});
								break;
							
							case 8: // backspace
								if (ngModel.$modelValue) {
									$timeout(function() {
										ngModel.$modelValue.slice(0, -1);
									});
								}
								
								event.stopPropagation();
								return false;
								break;
						}
					});
					break;
				
				case "PAPER-CHECKBOX":
					bindAngularAndPolymer("checked");
					break;
			}
			
			// helpers
			function getForm(element) {
				var form = element[0];
				
				while (form.nodeName !== "FORM") {
					var parent = form.parentNode;
					
					if (parent) {
						form = parent;
					} else {
						break;
					}
					
				}
				
				return angular.element(form);
			}
			
			function bindAngularAndPolymer(polymerValue) {
				var observer = new PathObserver(element[0], polymerValue);
				
				observer.open(function(newValue, oldValue) {
					if (ngModel.$modelValue === newValue) {
						return;
					}
					
					$timeout(function() {
						ngModel.$setViewValue(newValue);
					}, 0);
					
					if (debug) console.log(element[0], "setting angular model", newValue);
				});
				
				scope.$watch(function(){ return ngModel.$modelValue; }, function(newValue, oldValue) {
					if (element[0][polymerValue] === ngModel.$modelValue) {
						return;
					}
					
					element[0][polymerValue] = newValue;
					
					if (debug) console.log(element[0], "setting polymer " + polymerValue, newValue);
				});
				
				scope.$on("$destroy", function() {
					observer.close();
				});
			}
		}
	};
});