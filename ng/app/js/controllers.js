/* Controllers */
function DownloadCtrl($scope, $http) {
    sendCommand($http, 'command/aria2.getGlobalStat').success(function(data, status) {
        $scope.stats = JSON.stringify(data);
    });
}
DownloadCtrl.$inject = ['$scope', '$http'];

function SettingsCtrl($scope, $http) {
    function init() {
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
        sendCommand($http, 'command/aria2.changeGlobalOption', changeset).success(function(data, status) {
            $scope.reset();
            init();
            $('#alerts').append(getAlertHtml('Settings saved.', 'alert-success'));
        });
        $("html, body").animate({scrollTop: 0}, "slow");
    };

    $scope.isUnchanged = function() {
        return angular.equals($scope.settings, $scope.master);
    };

    $scope.reset = function() {
        $scope.settings = angular.copy($scope.master);
        if ($scope.filter.modified) {
            $('#mod').button('toggle');
        }
        $scope.filter = {
            query: '',
            modified: false
        };
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