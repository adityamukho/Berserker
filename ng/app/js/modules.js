'use strict';

/* Other modules */
angular.module('compile', [], function($compileProvider) {
  // configure new 'compile' directive by passing a directive
  // factory function. The factory function injects the '$compile'
  $compileProvider.directive('compile', function($compile) {
	// directive factory creates a link function
	return function(scope, element, attrs) {
	  scope.$watch(function(scope) {
		// watch the 'compile' expression for changes
		return scope.$eval(attrs.compile);
	  }, function(value) {
		// when the 'compile' expression changes
		// assign it into the current DOM
		element.html(value);

		// compile the new DOM and link it to the current
		// scope.
		// NOTE: we only compile .childNodes so that
		// we don't get into infinite loop compiling ourselves
		$compile(element.contents())(scope);
	  });
	};
  });
});

// Source: https://github.com/angular-ui/angular-ui
angular.module('ui.filters', []).filter(
	'unique',
	function() {
	  return function(items, filterOn) {
		if (filterOn === false) {
		  return items;
		}

		if ((filterOn || angular.isUndefined(filterOn))
			&& angular.isArray(items)) {
		  var hashCheck = {}, newItems = [];

		  var extractValueToCompare = function(item) {
			if (angular.isObject(item) && angular.isString(filterOn)) {
			  return item[filterOn];
			} else {
			  return item;
			}
		  };

		  angular.forEach(items, function(item) {
			var valueToCheck, isDuplicate = false;

			for ( var i = 0; i < newItems.length; i++) {
			  if (angular.equals(extractValueToCompare(newItems[i]),
				  extractValueToCompare(item))) {
				isDuplicate = true;
				break;
			  }
			}
			if (!isDuplicate) {
			  newItems.push(item);
			}

		  });
		  items = newItems;
		}
		return items;
	  };
	});

// Source: https://github.com/88media/JsonTreeDirective
angular
	.module('jsonTree', [])
	.directive(
		'jsonTree',
		[
			'$compile',
			'$parse',
			function($compile) {
			  return {
				terminal : true,
				replace : false,
				restrict : 'A',
				scope : {
				  jsonTree : '@',
				  expandPath : '@',
				  expand : '@'
				},
				link : function(scope, element, attrs) {
				  var tree = null;

				  scope.path = [];
				  scope.expand = (angular.isDefined(attrs.expand) && attrs.expand === "true");

				  var objectLength = function(obj) {
					var size = 0, key;
					for (key in obj) {
					  if (obj.hasOwnProperty(key))
						size++;
					}
					return size;
				  };

				  var traverse = function(data, parent, level) {
					tree = parent || "";
					tree += "<ul>";

					if (data) {
					  level++;

					  angular
						  .forEach(
							  data,
							  function(value, key) {

								if (angular.isObject(value)) {
								  var opened = (key === scope.path[level]) ? 'open'
									  : '';
								  if (level === 0)
									opened = 'open';
								  tree += "<li class='parent "
									  + opened
									  + "'><a href='#' ng-click='showChilds($event)'>"
									  + key + "</a>";

								  if (angular.isArray(value)) {
									tree += " [" + value.length + "]";
								  } else if (angular.isObject(value)) {
									tree += " {" + objectLength(value) + "}";
								  }

								  return traverse(value, tree, level); // pass
								  // in
								  // current level
								} else {
								  tree += "<li class='child'><strong>" + key
									  + ":</strong> ";
								  var suffix = '';
								  switch (key) {
									case 'bitfield':
									  var chars = value.split(""), spans = '';
									  for ( var i = 0; i < chars.length; ++i) {
									  	var rb = (0xf - parseInt(chars[i], 16)).toString(16);
										spans += '<li style="background: #'
											+ rb + 'f' + rb + '; border: solid 1px ' + (chars[i] === 'f' ? '#fff' : '#000') + ';"></li>';
									  }
									  value = spans;
									  tree += "<ul class='inline' id='bitfield'>" + value + "</ul>";
									  break;
									case 'uploadSpeed':
									case 'downloadSpeed':
									  suffix = '/s';
									case 'completedLength':
									case 'totalLength':
									case 'uploadLength':
									case 'pieceLength':
									case 'length':
									  value = '{{' + value + ' | bytes}}';
									default:
									  tree += "<em>" + value + suffix + "</em>";
								  }
								}
								tree += "</li>";
							  });

					} else {
					  level--; // going up
					}

					return tree += "</ul>";
				  };

				  var build = function(json) {
					return traverse(json, null, -1);
				  };

				  var expandAll = function() {
					angular.element(document.getElementsByClassName('parent'))
						.toggleClass('open');
				  };

				  scope.showChilds = function($event) {
					angular.element($event.target).parent().toggleClass('open');
					$event.preventDefault();
				  };

				  scope.expandAll = function($event) {
					scope.expand = (scope.expand) ? false : true; // toggle
					// state
					$event.preventDefault();
				  };

				  attrs.$observe('expandPath', function(path) {
					console.log(path);

					scope.path = (path) ? path.split('.') : [];
				  });

				  attrs.$observe('expand', function(val) {
					expandAll();
					scope.toggleTxt = (val) ? 'contract' : 'expand';
				  });

				  // init
				  attrs
					  .$observe(
						  'jsonTree',
						  function(data) {
							if (angular.isDefined(data)) {
							  var jsonData = JSON.parse(data)

							  try {
								var out = build(jsonData.results);
								element.html("").append(
									$compile(out)(scope).addClass('json-tree'));
							  } catch (err) {
								element
									.html("No valid JSON received! || I have to write some test...")
							  }
							}
						  });
				}
			  };
			} ]);