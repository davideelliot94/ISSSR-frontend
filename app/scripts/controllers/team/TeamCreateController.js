'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('TeamCreateCtrl', ['$scope', '$state', 'TeamDataFactory', 'ErrorStateRedirector',
        function ($scope, $state, TeamDataFactory, ErrorStateRedirector) {
            //console.log("creating");
            var ctrl = this;
            resetFieldsFn();
            ctrl.resetFields = resetFieldsFn;
            ctrl.insertTeam = insertTeamFn;

            function resetFieldsFn() {
                ctrl.currentTeam = {};
            }

            function insertTeamFn() {
                console.log('insertTeamFn: ' + ctrl.currentTeam.productOwner + "  " + ctrl.currentTeam.name + "   " + ctrl.currentTeam.scrumMaster + "    " + ctrl.currentTeam.teamMembers );
                TeamDataFactory.Insert(ctrl.currentTeam,
                    function (response) {
                        resetFieldsFn();
                        $state.go('team.list', {}, {reload: 'team.list'});
                    }, function (response) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'inserimento del team"})
                    });
            }
        }

    ]);