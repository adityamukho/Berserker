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
function DownloadListCtrl($scope, Command) {
    $scope.downloads = Command.get({command: 'aria2.getGlobalOption'});
}
DownloadListCtrl.$inject = ['$scope', 'Command'];

function SettingsCtrl($scope, $http) {
    sendCommand($http, 'command/aria2.getGlobalOption').success(function(data, status) {
        $scope.master = [];
        angular.forEach(data.result, function(value, key) {
            $scope.master.push({
                key: key,
                value: value
            });
        });
        $scope.settings = angular.copy($scope.master);
    });

    $scope.filter = {
        query: '',
        modified: false
    };

    $scope.update = function() {
        var changeset = {};
        for (var i = 0; i < $scope.settings.length; ++i) {
            if (!angular.equals($scope.settings[i], $scope.master[i])) {
                changeset[$scope.settings[i].key] = $scope.settings[i].value;
            }
        }
        sendCommand($http, 'command/aria2.changeGlobalOption').success(function(data, status) {
            console.dir(data);
        });
    };

    $scope.isUnchanged = function() {
        return angular.equals($scope.settings, $scope.master);
    };

    $scope.reset = function() {
        $scope.settings = angular.copy($scope.master);
        $scope.filter.query = '';
        if ($scope.filter.modified) {
            $('#mod').button('toggle');
            $scope.filter.modified = false;
        }
        $('ng-dirty').removeClass('ng-dirty').addClass('ng-pristine');
        $("html, body").animate({scrollTop: 0}, "slow");
    };

    $scope.toggleModified = function() {
        $scope.filter.modified = !$scope.filter.modified;
    };

    $scope.markDirty = function(setting) {
        setting.dirty = true;
    };
}
SettingsCtrl.$inject = ['$scope', '$http'];

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
});

/* Services */
angular.module('Berserker.services', []).value('version', '0.1');

/* Helper Functions */
function sendCommand($http, url) {
    return $http({
        method: 'POST',
        url: url,
        headers: {
            Accept: "application/json"
        }
    }).error(function(data, status) {
        console.error('Error - Status: %s\n Message: %j', status, data);
    });
}