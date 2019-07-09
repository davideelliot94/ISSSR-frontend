'use strict';
/* Controller che gestisce la finestra per le operazioni CRUD relative ad un Product Workflow Scrum*/
mainAngularModule
    .controller('scrumProductWorkflowController', ['$scope', '$state', '$mdDialog', 'ScrumProductWorkflowService',
    'ToasterNotifierHandler',
    function ($scope, $state, $mdDialog, ScrumProductWorkflowService, ToasterNotifierHandler) {

        $scope.scrumProductWorkflows = [];

        // Ottiene i dati che popoleranno la tabella dei Product Workflow esistenti
        $scope.populateScrumProductWorkflowTable = function () {
            ScrumProductWorkflowService.getAllScrumProductWorkflowService()
                .then(function successCallback(response) {
                    $scope.scrumProductWorkflows = response.data;
                }, function errorCallback(response) {
                    ToasterNotifierHandler.handleError(response);
                });
        };

        // Apertura di una finestra di dialogo per la visualizzazione di uno Scrum Product Workflow
        $scope.openScrumProductWorkflowDialog = function(item) {
            $mdDialog.show({
                controller: 'scrumProductWorkflowDialogController',
                templateUrl: 'views/scrum/scrumProductWorkflowDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                resolve: {
                    scrumProductWorkflow: function () {
                        return item;
                    }
                }
            }).then(function successCallback() {
                    // Se la creazione avviene con successo la schermata viene aggiornata
                    $scope.populateScrumProductWorkflowTable();
                },function errorCallback(){}
            );
        };

        // Metodo che invoca il service delegato all'interazione con il backend per la cancellazione dello scrum product workflow
        $scope.deleteScrumProductWorkflow = function(scrumProductWorkflow) {
            ScrumProductWorkflowService.deleteScrumProductWorkflowService(scrumProductWorkflow)
                .then(function successCallback() {
                    ToasterNotifierHandler.showSuccessToast('Eliminazione avvenuta con successo', '');
                    $scope.populateScrumProductWorkflowTable();
                }, function errorCallback(response){
                    if(response.status === 409){
                        ToasterNotifierHandler.showErrorToast('Impossibile eliminare un Workflow se esso è associato' +
                            ' a un Prodotto');
                    } else{
                        ToasterNotifierHandler.handleError(response);
                    }
                });
        };

        $scope.populateScrumProductWorkflowTable();
}]);