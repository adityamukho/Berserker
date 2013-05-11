'use strict';

/* Controllers */
function DownloadCtrl($scope, $http) {
    sendCommand($scope, $http, 'command/aria2.getGlobalStat').success(function(data, status) {
        $scope.stats = data.result;
    });
    sendCommand($scope, $http, 'command/aria2.getVersion').success(function(data, status) {
        $scope.version = data.result;
    });

    $scope.tabs = [
        {
            "title": "HTTP",
            "content": "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica."
        },
        {
            "title": "BitTorrent",
            "content": "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee."
        },
        {
            "title": "Metalink",
            "content": "Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade."
        }
    ];
    $scope.tabs.activeTab = 0;
}
DownloadCtrl.$inject = ['$scope', '$http'];

function SettingsCtrl($scope, $http) {
    function init() {
        sendCommand($scope, $http, 'command/aria2.getGlobalOption').success(function(data, status) {
            $scope.master = [];
            angular.forEach(data.result, function(value, key) {
                $scope.master.push({
                    key: key,
                    value: value
                });
            });
            $scope.settings = angular.copy($scope.master);
        });
    }
    init();

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
        sendCommand($scope, $http, 'command/aria2.changeGlobalOption', changeset).success(function(data, status) {
            $scope.reset();
            init();
            $scope.$emit('ALERT', {
                "type": "success",
                "title": "Success",
                "content": "Settings saved."
            });
        });
        $("html, body").scrollTop(0);
    };

    $scope.reset = function() {
        $scope.settings = angular.copy($scope.master);
        $scope.filter = {
            query: '',
            modified: false
        };
        $('ng-dirty').removeClass('ng-dirty').addClass('ng-pristine');
        $("html, body").scrollTop(0);
    };

    $scope.markDirty = function(setting) {
        setting.dirty = true;
    };
}
SettingsCtrl.$inject = ['$scope', '$http'];