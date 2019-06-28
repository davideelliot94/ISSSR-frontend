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

            console.log('inside team create controller');
            var ctrl = this;
            resetFieldsFn();

            ctrl.resetFields = resetFieldsFn;
            ctrl.insertTeam = insertTeamFn;

            function resetFieldsFn() {
                ctrl.currentTeam = {};
            }

            function insertTeamFn() {
                console.log("inside insert team fn");
                TeamDataFactory.Insert(ctrl.currentTeam,
                    function (response) {
                        console.log("ok response");
                        console.log(response);
                        resetFieldsFn();
                        $state.go('team.list', {}, {reload: 'team.list'});
                    }, function (response) {
                        console.log('error response');
                        let msgErr = "Errore nell'inserimento del team";

                        if(response.data === 'expiration'){
                            msgErr = 'Login session expired';
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});

                });
            }
        }

    ]);