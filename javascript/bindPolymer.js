angular.module("zacbarton.directives", []).directive("bindPolymer", function($q, $timeout) {
	var polymerReady = false;
	var debug = false;
	
	return {
		require: "ngModel"
		, restrict: "A"
		, link: function(scope, element, attrs, ngModel) {
			if (!ngModel)
				return;
			
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
			
			function bootstrap() {
				var nodeName = element[0].nodeName;
				var observer2;
				var observer;
				
				switch (nodeName) {
					case "PAPER-INPUT":
						element[0].value = ngModel.$modelValue;
						
						// hack to submit on "enter"
						observer2 = new PathObserver(element[0], 'value');
						observer2.open(function(newValue, oldValue) {
							if (ngModel.$invalid) return;
							
							var action = getForm(element).attr('ng-submit');
							
							$timeout(function() {
								scope.$eval(action);
							});
						});
						
						observer = new PathObserver(element[0], 'inputValue');
						observer.open(function(newValue, oldValue) {
							if (ngModel.$modelValue === newValue) return;
							
							$timeout(function() {
								if (debug) console.log(Date.now(), 'input - setting model', newValue, oldValue);
								
								ngModel.$setViewValue(newValue);
							}, 0);
						});
						
						scope.$watch(function(){ return ngModel.$modelValue;}, function(newValue, oldValue) {
							if (element[0].inputValue === ngModel.$modelValue) return;
							
							if (debug) console.log(Date.now(), 'input - setting value', newValue, oldValue);
							
							element[0].inputValue = newValue;
						});
						break;
					
					case "PAPER-CHECKBOX":
						element[0].checked = ngModel.$modelValue;
						
						observer = new PathObserver(element[0], 'checked');
						observer.open(function(newValue, oldValue) {
							if (ngModel.$modelValue === newValue) return;
							
							$timeout(function() {
								if (debug) console.log(Date.now(), 'checkbox - setting model', newValue, oldValue);
								
								ngModel.$setViewValue(newValue);
							}, 0);
						});
						
						scope.$watch(function(){ return ngModel.$modelValue;}, function(newValue, oldValue) {
							if (element[0].checked === ngModel.$modelValue) return;
							
							if (debug) console.log(Date.now(), 'checkbox - setting value', newValue, oldValue);
							
							element[0].checked = newValue;
						});
						break;
				}
			}
			
			if (!polymerReady) {
				document.addEventListener('polymer-ready', function() {
					polymerReady = true;
					bootstrap();
				});
			} else {
				bootstrap();
			}
			
			// TODO do destroy observer(s) on scope destroy
		}
	};
});