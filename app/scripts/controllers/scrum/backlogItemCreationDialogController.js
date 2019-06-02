'use strict';
mainAngularModule.controller('backlogItemCreationDialogController', ['$scope', '$mdDialog', 'productId', '$state',
    'ToasterNotifierHandler', 'BacklogItemService',
    function($scope, $mdDialog, productId, $state, ToasterNotifierHandler, BacklogItemService) {

    $scope.backlogItemPriorityClasses = ['LOW', 'MEDIUM', 'HIGH'];
    $scope.backlogItem ={};

    $scope.closeDialog = function() {
        $mdDialog.cancel();
    };

    $scope.insertBacklogItem = function () {
        BacklogItemService.insertBacklogItemService(productId, $scope.backlogItem)
            .then(function successCallback(response) {
                ToasterNotifierHandler.handleCreation(response);
                $mdDialog.hide();
                $state.go('backlog_management.view');

            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
    };


}]);