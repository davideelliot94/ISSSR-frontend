'use strict';

mainAngularModule.controller('viewSprintBacklogController', ['$scope', '$state', '$stateParams', 'BacklogItemService',
    'ToasterNotifierHandler', '$mdDialog',
    function ($scope, $state, $stateParams, BacklogItemService, ToasterNotifierHandler, $mdDialog){

    $scope.sprint = JSON.parse(sessionStorage.getItem('sprint'));
    $scope.product = JSON.parse(sessionStorage.getItem('product'));

    $scope.setItemToChange = function(event, ui, backlogItem){
        $scope.backlogItemToChange = backlogItem;
    };

    // Popolamento dello sprint backlog
    let populateSprintBacklog = function() {
        BacklogItemService.getSprintBacklogItemService($scope.product.id, $scope.sprint.number)
            .then(function successCallback(items) {
                // Alla lista degli item viene aggiunto un item fittizio che servirà da placeholder nell'interfaccia grafica
                items.push({
                    'id': '',
                    title: 'placeholder',
                    description: 'placeholder',
                    status: '',
                    effortEstimation: 0,
                    priority: 'PLACEHOLDER'
                });
                $scope.sprintBacklogItems = items;
                $scope.isActiveSprint = true;
            }, function errorCallback(response) {
                if (response.status === 404) {
                    $scope.isActiveSprint = false;
                } else {
                    ToasterNotifierHandler.handleError(response);
                }
            });
    };

    // Porta lo stato dell'item in trascinamento al valore specificato
    $scope.changeItemStateTo = function(event, ui, newState){
        BacklogItemService.changeItemStateToService($scope.backlogItemToChange.id, newState)
            .then(function successCallback() {
                populateSprintBacklog();
            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
    };

    // Apre la finestra di dettaglio contenente le informazioni sull'item del backlog
    $scope.openSprintBacklogItemDetailDialog = function(sprintBacklogItem) {
        $mdDialog.show({
            controller: 'backlogItemDetailDialogController',
            templateUrl: 'views/scrum/backlogItemDetailDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            // Passaggio del prodotto e dell'item selezionato
            resolve: {
                selectedBacklogItem: function () {
                    return sprintBacklogItem;
                }
            }
        });
    };

    // Questa funzione valorizza la priorità di un item in modo tale da poter
    // ordinare le voci all'interno dello Sprint Backlog
    $scope.priorityLevel = function(backlogItem) {
        if (backlogItem.priority === 'HIGH') {
            return 1;
        } else if (backlogItem.priority === 'MEDIUM') {
            return 2;
        } else if (backlogItem.priority === 'LOW'){
            return 3;
        } else {
            return 4;
        }
    };

    populateSprintBacklog();

}]);