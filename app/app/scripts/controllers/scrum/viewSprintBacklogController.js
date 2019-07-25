'use strict';

mainAngularModule.controller('viewSprintBacklogController', ['$scope', '$state', '$stateParams', 'BacklogItemService',
    'ToasterNotifierHandler', '$mdDialog', '$filter',
    function ($scope, $state, $stateParams, BacklogItemService, ToasterNotifierHandler, $mdDialog, $filter){

    $scope.sprint = JSON.parse(sessionStorage.getItem('sprint'));
    $scope.product = JSON.parse(sessionStorage.getItem('product'));
    $scope.sprintBacklogItems = [];

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
                    priority: -1
                });
                $scope.sprintBacklogItems = items;
            }, function errorCallback() {
                ToasterNotifierHandler.showErrorToast('Errore nel recupero degli item nello Sprint Backlog');
            });
    };

    // Porta lo stato dell'item in trascinamento al valore specificato
    $scope.changeItemStateTo = function(event, ui, newState){
        BacklogItemService.changeItemStateToService($scope.backlogItemToChange.id, newState)
            .then(function successCallback(response) {
                $scope.sprintBacklogItems = $filter('filter')($scope.sprintBacklogItems,
                    function(value) {return value.id !== $scope.backlogItemToChange.id;});
                $scope.sprintBacklogItems.push(response.data);
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

    populateSprintBacklog();

}]);