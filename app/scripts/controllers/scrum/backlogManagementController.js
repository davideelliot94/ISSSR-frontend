'use strict';

mainAngularModule.controller('backlogManagementController', ['$scope', '$state', '$mdDialog', 'ScrumProductService',
    'ToasterNotifierHandler', 'BacklogItemService', 'DTOptionsBuilder',
    function ($scope, $state, $mdDialog, ScrumProductService, ToasterNotifierHandler, BacklogItemService, DTOptionsBuilder) {

    // backlogItem selected
    $scope.backlogItem = {};
    // list of item in product backlog for selected product
    $scope.backlogItems = {};
    // list of item in sprint backlog for selected product
    $scope.sprintBacklogItems = {};
    // default option for datatable
    $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');

    $scope.isActiveSprint = false;
    $scope.isSelectedProduct = false;

    // Si inizializza la combobox con tutti i prodotti su cui lavora uno Scrum Team di cui fa parte l'utente loggato
    let initializeProductList = function () {
        ScrumProductService.getProductByScrumMember()
            .then(function successCallback(products) {
                $scope.productsOfScrumMember = products;
            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
    };

    // Apertura di una finestra di dialogo per l'inserimento del Backlog Item
    $scope.openBacklogItemCreationDialog = function() {
        $mdDialog.show({
            controller: 'backlogItemCreationDialogController',
            templateUrl: 'views/scrum/backlogItemCreationDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            // Passaggio dell'id del prodotto selezionato
            resolve: {
                productId: function () {
                    return $scope.backlogItem.product.id;
                }
            }
        }).then(function successCallback(){
            // Se la creazione avviene con successo la schermata viene aggiornata
            $scope.populateBacklogAndSprintBacklog();
        }, function errorCallback(){}
        );
    };

    // Apertura di una finestra di dialogo per l'inserimento del Backlog Item nello Sprint Backlog
    $scope.openBacklogItemEditDialog = function(backlogItem) {
        $mdDialog.show({
            controller: 'backlogItemEditDialogController',
            templateUrl: 'views/scrum/backlogItemEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            // Passaggio del prodotto e dell'item selezionato
            resolve: {
                selectedBacklogItem: function () {
                    return backlogItem;
                },
                productId: function () {
                    return $scope.backlogItem.product.id;
                }
            }
        }).then(function successCallback(){
                // Se l'utente conferma l'inserimento nello sprint backlog la schermata viene aggiornata
                $scope.populateBacklogAndSprintBacklog();
            }, function errorCallback(){}
        );
    };

    // Funzione che popola il backlog e lo sprint backlog con gli item ricevuti dal backend
    $scope.populateBacklogAndSprintBacklog = function() {
        $scope.isSelectedProduct = true;

        // Popolamento del product backlog
        BacklogItemService.getProductBacklogItemService($scope.backlogItem.product.id)
            .then(function successCallback(items) {
                $scope.backlogItems = items;
            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
        // Popolamento dello sprint backlog
        BacklogItemService.getSprintBacklogItemService($scope.backlogItem.product.id)
            .then(function successCallback(items) {
                $scope.sprintBacklogItems = items;
                $scope.isActiveSprint = true;
            }, function errorCallback(response){
                if (response.status === 404){
                    $scope.isActiveSprint = false;
                } else{
                    ToasterNotifierHandler.handleError(response);
                }
            });
    };

    $scope.changeStatusToSprintBacklogItem = function(itemId, direction){
        BacklogItemService.changeStatusToSprintBacklogItemService(itemId, direction)
            .then(function successCallback() {
                $scope.populateBacklogAndSprintBacklog();
            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
    };

    initializeProductList();

}]);