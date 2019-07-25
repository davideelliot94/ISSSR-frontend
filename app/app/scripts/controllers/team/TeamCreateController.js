'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('TeamCreateCtrl', ['$scope', '$state', 'jwtHelper','AuthFactory','TeamDataFactory', 'ErrorStateRedirector',
        function ($scope, $state,jwtHelper, AuthFactory,TeamDataFactory, ErrorStateRedirector) {

            console.log('inside team create controller');
            var ctrl = this;
            resetFieldsFn();

            ctrl.resetFields = resetFieldsFn;
            ctrl.insertTeam = insertTeamFn;

            function resetFieldsFn() {
                ctrl.currentTeam = {};
            }

            function insertTeamFn() {
                TeamDataFactory.Insert(ctrl.currentTeam,
                    function (response) {
                        resetFieldsFn();

                        $state.go('team.list', {}, {reload: 'team.list'});
                    }, function (response) {
                        let msgErr = "Errore nell'inserimento del team";

                        if(response.data === 'expiration'){
                            msgErr = 'Login session expired';
                            sessionStorage.removeItem('authInfo');
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});

                });
            }
        }

    ]);