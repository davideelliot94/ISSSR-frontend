'use strict';

mainAngularModule.controller('ScrumTeamDialogController', ['$scope', '$stateParams', 'scrumTeam', '$mdDialog',
    function ($scope, $stateParams, scrumTeam, $mdDialog) {

        $scope.currentScrumTeam = angular.copy(scrumTeam);

        $scope.scrumTeamMembers = $scope.currentScrumTeam.teamMembers;
        $scope.scrumTeamProductOwner = $scope.currentScrumTeam.productOwner;
        $scope.scrumTeamScrumMaster = $scope.currentScrumTeam.scrumMaster


        $scope.closeTeamDialog = function () {
            $mdDialog.cancel();
        };




    }]);