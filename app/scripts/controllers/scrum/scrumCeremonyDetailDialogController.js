'use strict';

mainAngularModule.controller('scrumCeremonyDetailDialogController',
    ['$scope', '$mdDialog', 'scrumCeremony',
        function($scope, $mdDialog, scrumCeremony) {

            $scope.scrumCeremony = angular.copy(scrumCeremony);

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

}]);