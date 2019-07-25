'use strict';
// Controller che gestisce la finestra contenente il form di creazione di un item all'interno del product backlog
mainAngularModule.controller('backlogItemCreationDialogController', ['$scope', '$mdDialog', 'productId', '$state',
    'ToasterNotifierHandler', 'BacklogItemService',
    function($scope, $mdDialog, productId, $state, ToasterNotifierHandler, BacklogItemService) {

    $scope.backlogItemPriorityClasses = ['LOW', 'MEDIUM', 'HIGH']; // non più usati
    $scope.backlogItem ={};

    $scope.closeDialog = function() {
        $mdDialog.cancel();
    };

    // Inserisce un item all'interno del product backlog
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