'use strict';

mainAngularModule.controller('scrumCeremonyCreationDialogController',
    ['$scope', 'ScrumTeamDataFactory','sprintId', 'ToasterNotifierHandler','$mdDialog', 'ScrumCeremonyService', '$state',
    function($scope, ScrumTeamDataFactory, sprintId, ToasterNotifierHandler, $mdDialog, ScrumCeremonyService, $state) {

        $scope.participants = [];
        $scope.ceremonyActivities = [];
        $scope.newActivity = {};

        $scope.scrumCeremonyTypes = [{'key': 'SPRINT_REVIEW', 'value': 'Sprint Review'},
            {'key': 'SPRINT_PLANNING_MEETING', 'value': 'Sprint Planning Meeting'},
            {'key': 'SPRINT_RETROSPECTIVE', 'value': 'Sprint Retrospective'}];

        $scope.getSprintParticipants = function () {
            ScrumTeamDataFactory.FindScrumTeamBySprint(sprintId).
            then(function successCallback(response) {
                $scope.sprintParticipants = response;
            }, function errorCallback(response) {
                ToasterNotifierHandler.handleError(response);
            });
        };

        $scope.addParticipant = function(user) {
          $scope.participants.push(user);
        };

        $scope.removeParticipant = function(user) {
            $scope.participants.splice($scope.participants.indexOf(user), 1 );
        };

        $scope.deleteActivity = function(activity) {
            $scope.ceremonyActivities.splice($scope.ceremonyActivities.indexOf(activity), 1);
        };

        $scope.insertNewActivity = function() {
            $scope.ceremonyActivities.push($scope.newActivity);
            $scope.newActivity = {};
        };

        $scope.closeDialog = function() {
          $mdDialog.cancel();
        };

        $scope.insertScrumCeremony = function() {

            // costruisco la lista dei partecipanti
            let participantsDto = [];
            let i;
            for (i = 0; i < $scope.participants.length; i++) {
                participantsDto.push({'id': $scope.participants[i].id, 'firstName': $scope.participants[i].firstName, 'lastName': $scope.participants[i].lastName});
            }
            let scrumCeremony = {
                'type': $scope.scrumCeremonyType.key,
                'date': $scope.scrumCeremonyDate,
                'duration': $scope.scrumCeremonyDuration,
                'activities': $scope.ceremonyActivities,
                'sprintId': sprintId,
                'participants': participantsDto
            };
            ScrumCeremonyService.createScrumCeremony(scrumCeremony).then(function successCallback(response) {
                ToasterNotifierHandler.handleCreation(response);
                $mdDialog.hide();
                $state.go('scrum_ceremonies.view');
            }, function errorCallback(response) {
               ToasterNotifierHandler.handleError(response);
            });
        };

        $scope.getSprintParticipants();
    }]);