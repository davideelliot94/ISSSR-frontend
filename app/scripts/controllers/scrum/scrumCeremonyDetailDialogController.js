'use strict';

mainAngularModule.controller('scrumCeremonyDetailDialogController',
    ['$scope', '$mdDialog', 'scrumCeremony',
        function($scope, $mdDialog, scrumCeremony) {

            $scope.scrumCeremony = angular.copy(scrumCeremony);

}]);