'use strict';
mainAngularModule.controller('backlogItemEditDialogController', ['$scope', '$mdDialog', 'selectedBacklogItem',
    'BacklogItemService', 'ToasterNotifierHandler', '$state', 'productId', 'SprintService',
    function($scope, $mdDialog, selectedBacklogItem, BacklogItemService, ToasterNotifierHandler, $state, productId,
             SprintService) {

        $scope.backlogItemPriorityClasses = ['LOW', 'MEDIUM', 'HIGH'];
        $scope.backlogItem = angular.copy(selectedBacklogItem);
        $scope.productSprints = [];

        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };

        $scope.editBacklogItem = function() {
            BacklogItemService.editBacklogItemService($scope.backlogItem)
                .then(function successCallback() {
                    ToasterNotifierHandler.showSuccessToast('Operazione avvenuta con successo', '');
                    $mdDialog.hide();
                    $state.go('backlog_management.view');
                }, function errorCallback(){
                    ToasterNotifierHandler.showErrorToast('Operazione Fallita');
                });
        };

        // WARNING: NOT USED
        $scope.insertBacklogItemToSprintBacklog = function () {
            BacklogItemService.insertBacklogItemToSprintBacklogService(productId, $scope.backlogItem)
                .then(function successCallback() {
                    ToasterNotifierHandler.showSuccessToast('Operazione avvenuta con successo', '');
                    $mdDialog.hide();
                    $state.go('backlog_management.view');
                }, function errorCallback(response){
                    if (response.status === 422){
                        ToasterNotifierHandler.showErrorToast(
                            'Prima di inserire un item nello Sprint Backlog è necessario creare lo sprint.');
                    } else {
                        ToasterNotifierHandler.handleError(response);
                    }
                });
        };

        //Restituisce l'elenco degli sprint non chiusi per il prodotto selezionato
        let getAllNotClosedSprintOfProduct = function () {
            SprintService.getAllSprintOfProductService(productId)
                .then(function successCallback(response) {
                        for(let i = 0; i < response.length; i++){
                            if (response[i].isActive !== false){
                                ($scope.productSprints).push(response[i]);
                            }
                        }
                    },
                    function errorCallback(response){
                        ToasterNotifierHandler.handleError(response);
                    });
        };

        getAllNotClosedSprintOfProduct();

    }]);