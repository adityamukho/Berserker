'use strict';

/* Modules */
// Declare app level module which depends on filters, and services
angular.module('Berserker', ['Berserker.filters', 'Berserker.services', 'Berserker.directives',
    '$strap.directives', 'ui.filters', 'jsonTree'])
        .config(
        [
            '$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/downloads', {
                    templateUrl: 'partials/downloads.html',
                    controller: DownloadCtrl
                })
                        .when(
                        '/settings', {
                    templateUrl: 'partials/settings.html',
                    controller: SettingsCtrl
                })
                        .otherwise({
                    redirectTo: '/downloads'});
            }])
        .run(function($rootScope) {
    $rootScope.alerts = [];
    $rootScope.$on('ALERT', function(event, alert) {
        $rootScope.alerts.push(alert);
    });
});

/* Directives */
angular.module('Berserker.directives', [])
        .directive('appVersion',
        ['version', function(version) {
                return function(scope, elm, attrs) {
                    elm.text(version);
                };
            }]);

/* Filters */
angular.module('Berserker.filters', []).filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]).filter('settingsFilter', function() {
    return function(items, field) {
        var result = [];
        if (typeof items === 'object') {
            for (var i = 0; i < items.length; ++i) {
                if ((items[i].key + items[i].value).indexOf(field.query) !== -1) {
                    if (!field.modified || items[i].dirty) {
                        result.push(items[i]);
                    }
                }
            }
        }
        return result;
    };
}).filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'],
                number = bytes > 0 ? Math.floor(Math.log(bytes) / Math.log(1024)) : 0;
        if (number) {
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }
        else {
            return '0 B';
        }
    };
});

/* Services */
angular.module('Berserker.services', []).value('version', '0.0.1');

/* Helper Functions */
function sendCommand($scope, $http, command, data, defaultErrHandler) {
    var result = $http({
        method: 'POST',
        url: 'command/' + command,
        data: data,
        headers: {
            Accept: "application/json"
        }
    });
    if (typeof defaultErrHandler === 'function') {
        result.error(defaultErrHandler);
    }
    else if (defaultErrHandler !== false) {
        result.error(function(data, status) {
            $scope.$emit('ALERT', {
                "type": "error",
                "title": "Error",
                "content": JSON.stringify(data)
            });
        });
    }

    return result;
}