'use strict';

mainAngularModule.controller('scrumCeremoniesController', ['$scope', 'SprintService', 'AuthFactory', 'ToasterNotifierHandler', 'ScrumCeremonyService', '$mdDialog',
    function ($scope, SprintService, AuthFactory, ToasterNotifierHandler, ScrumCeremonyService, $mdDialog){

    $scope.sprints = [];

    // funzione usata per il rendering del tipo della scrum ceremony
    $scope.formatType = function (type) {
        if (type === 'SPRINT_REVIEW') {
            return 'Sprint Review';
        } else if (type === 'SPRINT_RETROSPECTIVE') {
            return 'Sprint Retrospective';
        } else {
            return 'Sprint Planning Meeting';
        }
    };

    // restituisce gli sprint su cui l'utente lavora
    $scope.getSprints = function () {
        let userId = AuthFactory.getAuthInfo().userId;
        SprintService.getUserSprints(userId).then(
            function successCallback(response) {
                $scope.sprints = response;
            }, function errorCallback(response) {
                ToasterNotifierHandler.handleError(response);
            }
        );
    };

    // riempie lo storico delle scrum ceremonies
    $scope.populateScrumCeremoniesHistory = function() {
        ScrumCeremonyService.getSprintScrumCeremonies($scope.selectedSprint.id).
        then(function successCallback(response) {
            $scope.scrumCeremonies = response;
        }, function errorCallback(response) {
            ToasterNotifierHandler.handleError(response);
        });
    };

    // si attiva quando l'utente seleziona lo sprint di cui intende visionare le ceremonies
    $scope.visualizeScrumCeremoniesHistoryTrigger = function () {
        $scope.populateScrumCeremoniesHistory();
        $scope.visualizeScrumCeremonies = true;
    };

    // Apertura finestra di dialogo per la creazione della Scrum Ceremony
    $scope.addScrumCeremony = function() {
        $mdDialog.show({
            controller: 'scrumCeremonyCreationDialogController',
            templateUrl: 'views/scrum/scrumCeremonyCreateDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            // Alla finestra di dialogo viene passato l'id dello sprint
            resolve: {
                sprintId: function () {
                    return $scope.selectedSprint.id;
                }
            }
        }).then(function successCallback(){
                // Se la creazione avviene con successo la schermata viene aggiornata
                $scope.populateScrumCeremoniesHistory();
            }, function errorCallback(){}
        );
    };

    // Apertura finestra di dialogo per la visualizzazione dei dettagli sull'evento Scrum
    $scope.showCeremonyDetail = function(scrumCeremony) {
        $mdDialog.show({
            controller: 'scrumCeremonyDetailDialogController',
            templateUrl: 'views/scrum/scrumCeremonyDetailDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            // Alla finestra di dialogo viene passato la Scrum Ceremony da visualizzare in dettaglio
            resolve: {
                scrumCeremony: function () {
                    return scrumCeremony;
                }
            }
        });
    };

    $scope.getSprints();
}]);