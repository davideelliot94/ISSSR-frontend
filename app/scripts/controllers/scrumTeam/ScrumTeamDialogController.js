'use strict';
/* Controller che gestisce la finestra di dialogo che visualizza i componenti di uno Scrum Team*/
mainAngularModule.controller('ScrumTeamDialogController', ['$scope', '$stateParams', 'scrumTeam', '$mdDialog',
    function ($scope, $stateParams, scrumTeam, $mdDialog) {

        // lettura parametro passato nell'apertura della finestra di dialogo
        $scope.currentScrumTeam = angular.copy(scrumTeam);

        $scope.scrumTeamMembers = $scope.currentScrumTeam.teamMembers;
        $scope.scrumTeamProductOwner = $scope.currentScrumTeam.productOwner;
        $scope.scrumTeamScrumMaster = $scope.currentScrumTeam.scrumMaster;

        // handler per la chiusura della finestra di dialogo
        $scope.closeTeamDialog = function () {
            $mdDialog.cancel();
        };
    }]);