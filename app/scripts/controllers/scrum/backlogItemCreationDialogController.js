'use strict';
mainAngularModule.controller('backlogItemCreationDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog) {
    $scope.backlogItemPriorityClasses = ['LOW', 'MEDIUM', 'HIGH'];
    $scope.closeDialog = function() {
      $mdDialog.cancel();
    };
}]);