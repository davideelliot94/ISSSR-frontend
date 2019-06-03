'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('ScrumTeamCreateCtrl', ['$scope', '$state', 'ScrumTeamDataFactory', 'ErrorStateRedirector',
        function ($scope, $state, ScrumTeamDataFactory, ErrorStateRedirector) {

            var ctrl = this;
            resetFieldsFn();

            ctrl.resetFields = resetFieldsFn;
            ctrl.insertScrumTeam = insertScrumTeamFn;

            function resetFieldsFn() {
                console.log('ResetScurmTeamFn')

                ctrl.currentScrumTeam = {};
            }

            function insertScrumTeamFn() {
                console.log('insertScurmTeamFn')
                ScrumTeamDataFactory.Insert(ctrl.currentScrumTeam,
                    function (response) {
                        console.log(response);
                        resetFieldsFn();
                        $state.go('scrumTeam.assign', {}, {reload: 'scrumTeam.assign'});
                    }, function (response) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'inserimento dello scrum team"})
                    });
            }
        }


    ]);