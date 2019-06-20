'use strict';
mainAngularModule.controller('backlogItemDetailDialogController', ['$scope', '$mdDialog', 'selectedBacklogItem',
    function($scope, $mdDialog, selectedBacklogItem) {

        $scope.backlogItem = angular.copy(selectedBacklogItem);

        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };

    }]);