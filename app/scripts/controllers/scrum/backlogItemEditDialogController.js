'use strict';
mainAngularModule.controller('backlogItemEditDialogController', ['$scope', '$mdDialog', 'selectedBacklogItem',
    'BacklogItemService', 'ToasterNotifierHandler', '$state', 'productId', 'SprintService',
    function($scope, $mdDialog, selectedBacklogItem, BacklogItemService, ToasterNotifierHandler, $state, productId,
             SprintService) {

        $scope.backlogItemPriorityClasses = ['LOW', 'MEDIUM', 'HIGH'];
        $scope.backlogItem = angular.copy(selectedBacklogItem);

        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };

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

        let getAllSprintOfProduct = function () {
            SprintService.getAllSprintOfProductService(productId)
                .then(function successCallback(response) {
                        $scope.productSprints = response;
                    },
                    function errorCallback(response){
                        ToasterNotifierHandler.handleError(response);
                    });
        };

        getAllSprintOfProduct();

    }]);