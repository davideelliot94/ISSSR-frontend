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
                console.log("inside insert team fn");
                TeamDataFactory.Insert(ctrl.currentTeam,
                    function (response) {
                        console.log("ok response");
                        console.log(response);
                        resetFieldsFn();
                        let authInfo = JSON.parse(sessionStorage.get("authInfo"));
                        let token = authInfo.jwtToken;
                        console.log("is token expired?: " + jwtHelper.isTokenExpired(token));

                        $state.go('team.list', {}, {reload: 'team.list'});
                    }, function (response) {
                        console.log('error response');
                        let msgErr = "Errore nell'inserimento del team";

                        if(response.data === 'expiration'){
                            msgErr = 'Login session expired';
                            AuthFactory.deleteAuthInfo();
                            console.log('ok1');
                            sessionStorage.removeItem('authInfo');
                            console.log('ok2');
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});

                });
            }
        }

    ]);