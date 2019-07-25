'use strict';
// controller che gestisce la finestra di visualizzazione dei dettagli relativi ad un item (apribile quando l'item
// si trova all'interno della Scrum Board)
mainAngularModule.controller('backlogItemDetailDialogController', ['$scope', '$mdDialog', 'selectedBacklogItem',
    function($scope, $mdDialog, selectedBacklogItem) {

        $scope.backlogItem = angular.copy(selectedBacklogItem);

        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };

    }]);