'use strict';
// Controller che gestisce la finestra di modifia di un backlog item
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

        // Modifica il backlog item con le nuove informazioni immesse
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