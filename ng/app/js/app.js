'use strict';

/* Modules */
// Declare app level module which depends on filters, and services
angular.module('Berserker', ['Berserker.filters', 'Berserker.services', 'Berserker.directives'])
        .config(
        [
            '$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/downloads', {
                    templateUrl: 'partials/downloads.html',
                    controller: DownloadListCtrl
                })
                        .when(
                        '/settings', {
                    templateUrl: 'partials/settings.html',
                    controller: SettingsCtrl
                })
                        .otherwise({
                    redirectTo: '/settings'});
            }]);

/* Controllers */
function DownloadListCtrl($scope, Download) {
    $scope.downloads = Download.query( );
}
DownloadListCtrl.$inject = ['$scope', 'Download'];

function SettingsCtrl($scope, Settings) {
    $scope.settings = Settings.query( );
    $scope.query = '';
}
SettingsCtrl.$inject = ['$scope', 'Settings'];

/* Directives */
angular.module('Berserker.directives', ['$strap.directives'])
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
        }
    }]).filter('kvFilter', function() {
    return function(items, field) {
        var result = {};
        angular.forEach(items, function(value, key) {
            if ((key.indexOf(field) !== -1) || (value.indexOf(field) !== -1)) {
                result[key] = value;
            }
        });
        return result;
    };
});

/* Services */
angular.module('Berserker.services', ['ngResource']).value('version', '0.1')
        .factory('Download', ['$resource', function($resource) {
        return $resource('/command/aria2.getGlobalOption', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }])
        .factory('Settings', ['$resource', function($resource) {
        return $resource('/command/aria2.getGlobalOption', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }]);