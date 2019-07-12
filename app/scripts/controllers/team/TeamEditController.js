'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('TeamEditCtrl', ['$scope', '$state', '$stateParams', 'TeamDataFactory', 'ErrorStateRedirector',
        function ($scope, $state, $stateParams, TeamDataFactory, ErrorStateRedirector) {

            var ctrl = this;
            ctrl.saveTeam = saveTeamFn;

            setCurrentTeam();

            function setCurrentTeam() {
                TeamDataFactory.GetSingle($stateParams.teamId,
                    function (team) {
                        ctrl.currentTeam = team;
                    }, function (response) {
                        let msgErr = "Errore nel recupero del team";
                        if(response.data === "expiration"){
                            msgErr = "Login session expired"
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});
                    });
            }

            function saveTeamFn() {
                TeamDataFactory.Update(ctrl.currentTeam,
                    function (response) {
                        console.log(response);
                        $state.go('team.list', {}, {reload: 'team.list'});
                    }, function (response) {
                        let msgErr = "Errore nel salvataggio del Team";
                        if(response.data === "expiration"){
                            msgErr = "Login session expired"
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});
                    });
            }
        }


    ]);

