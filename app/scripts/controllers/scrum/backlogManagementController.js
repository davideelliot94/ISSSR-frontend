'use strict';

mainAngularModule.controller('backlogManagementController', ['$scope', '$state', '$mdDialog', function ($scope, $state, $mdDialog) {
    var initializeProductList = function () {
        //TODO ottenere i prodotti su cui il Product Owner sta lavorando
    };

    initializeProductList();

    $scope.openBacklogItemCreationDialog = function() {
        $mdDialog.show({
            controller: 'backlogItemCreationDialogController',
            templateUrl: 'views/scrum/backlogItemCreationDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    };
}]);