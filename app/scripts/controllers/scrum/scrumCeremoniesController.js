'use strict';

mainAngularModule.controller('scrumCeremoniesController', ['$scope', 'SprintService', 'AuthFactory', 'ToasterNotifierHandler', 'ScrumCeremonyService', '$mdDialog',
    function ($scope, SprintService, AuthFactory, ToasterNotifierHandler, ScrumCeremonyService, $mdDialog){

    $scope.sprints = [];

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

    $scope.populateScrumCeremoniesHistory = function() {
        ScrumCeremonyService.getSprintScrumCeremonies($scope.selectedSprint.id).
        then(function successCallback(response) {
            $scope.scrumCeremonies = response;
        }, function errorCallback(response) {
            ToasterNotifierHandler.handleError(response);
        });
    };

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