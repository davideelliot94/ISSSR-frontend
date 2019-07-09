'use strict';
/* Controller che gestisce la finestra di dialogo usata per la creazione di un Product Workflow Scrum o per la visualizzazione di
* un workflow esistente*/
mainAngularModule.controller('scrumProductWorkflowDialogController', ['$scope', '$mdDialog',  '$state',
    'ToasterNotifierHandler', 'ScrumProductWorkflowService', 'scrumProductWorkflow',
    function($scope, $mdDialog, $state, ToasterNotifierHandler, ScrumProductWorkflowService, scrumProductWorkflow) {

        // Se scrumProductWorkflow è null significa che si sta creando un nuovo scrum Product Workflow altrimenti
        // ci si trova in fase di visualizzazione dello scrum Product Workflow.
        $scope.newStateName = '';
        if (scrumProductWorkflow === null){
            $scope.scrumProductWorkflow ={};
            $scope.scrumProductWorkflow.states = ['1*To do'];
            $scope.statesNumber = 2;
        } else {
            $scope.scrumProductWorkflow = angular.copy(scrumProductWorkflow);
            $scope.statesNumber = scrumProductWorkflow.states.length;
        }

        // Handler per la chiusura della finestra di dialogo
        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };

        // Aggiunge uno stato all'elenco degli stati del product workflow
        $scope.insertScrumProductWorkflowState = function () {
            $scope.scrumProductWorkflow.states.push($scope.statesNumber + '*' + $scope.newStateName);
            $scope.statesNumber += 1;
            $scope.newStateName = '';
        };

        // Rimuove uno stato dall'elenco degli stati del product workflow
        $scope.deleteScrumProductWorkflowState = function (state) {
            $scope.scrumProductWorkflow.states.splice($scope.scrumProductWorkflow.states.indexOf(state), 1);
            let stateNumber = $scope.getNumber(state);
            for (let index = 0; index < $scope.scrumProductWorkflow.states.length; index++) {
                let currentStateNumber = $scope.getNumber($scope.scrumProductWorkflow.states[index]);
                if (currentStateNumber > stateNumber) {
                    $scope.scrumProductWorkflow.states[index] =
                        ($scope.getNumber($scope.scrumProductWorkflow.states[index]) - 1).toString() + '*' +
                        $scope.scrumProductWorkflow.states[index].split('*')[1];
                }
            }
            $scope.statesNumber -= 1;
        };

        // Parsa dal nome di uno stato il suo indice
        $scope.getNumber = function (state) {
            let number = state.split('*')[0];
            return parseInt(number);
        };

        $scope.getOperation = function() {
            if (scrumProductWorkflow === null){
                return 'Inserisci';
            } else {
                return 'Modifica';
            }
        };

        $scope.doOp = function(){
            if (scrumProductWorkflow === null){
                $scope.insertScrumProductWorkflow();
            } else {
                $scope.modifyScrumProductWorkflow();
            }
        };

        // Invoca il servizio responsabile alla chiamata al backend per l'inserimento
        $scope.insertScrumProductWorkflow = function () {
            $scope.scrumProductWorkflow.states.push(($scope.statesNumber) + '*Completato');
            ScrumProductWorkflowService.insertScrumProductWorkflowService($scope.scrumProductWorkflow)
                .then(function successCallback(response) {
                    ToasterNotifierHandler.handleCreation(response);
                    $mdDialog.hide();
                    $state.go('scrum.product_workflow');

                }, function errorCallback(response){
                    ToasterNotifierHandler.handleError(response);
                });
        };

        // Invoca il servizio responsabile alla chiamata al backend per la modifica
        $scope.modifyScrumProductWorkflow = function () {
            // Rimozione del vecchio stato "Completato" e inserimento del nuovo
            let statusCompleted;
            for (let index = 0; index < $scope.scrumProductWorkflow.states.length; index++) {
                if ($scope.scrumProductWorkflow.states[index].split('*')[1] === 'Completato'){
                    statusCompleted = $scope.scrumProductWorkflow.states[index];
                }
            }
            $scope.scrumProductWorkflow.states.splice($scope.scrumProductWorkflow.states.indexOf(statusCompleted), 1);
            $scope.scrumProductWorkflow.states.push(($scope.statesNumber) + '*Completato');

            ScrumProductWorkflowService.modifyScrumProductWorkflowService($scope.scrumProductWorkflow)
                .then(function successCallback() {
                    ToasterNotifierHandler.showSuccessToast('Modifica avvenuta con successo', '');
                    $mdDialog.hide();
                    $state.go('scrum.product_workflow');

                }, function errorCallback(response){
                    if (response.status === 409){
                        ToasterNotifierHandler.showErrorToast('Impossibile modificare un Workflow se esso è associato' +
                            ' a un Prodotto avente uno Sprint attivo');
                        $mdDialog.hide();
                    }else {
                        ToasterNotifierHandler.handleError(response);
                    }
                });
        };

    }]);