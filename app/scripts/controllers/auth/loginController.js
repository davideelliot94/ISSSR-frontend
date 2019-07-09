'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LoginCtrl
 */
mainAngularModule
    .controller('LoginCtrl', ['$scope', '$state','$window', 'AuthFactory','AclService','storageService', 'ToasterNotifierHandler','BacklogItemService',
        function ($scope, $state,$window, AuthFactory,AclService,storageService,ToasterNotifierHandler) {

            let ctrl = this;
            ctrl.authRequest = {username: 'admin', password: 'password'};
            ctrl.doLogin = doLoginFn;


            ctrl.authMessage = '';

            let authInfo = JSON.parse(sessionStorage.getItem('authInfo'));


            if(authInfo !== null && authInfo !== undefined){

                AuthFactory.setJWTAuthInfo(authInfo);
                $state.go("dashboard.home");
            }


            function doLoginFn() {
                AuthFactory.sendLogin(ctrl.authRequest, successCB, errorCB);

                function successCB(response) {
                    let authInfo = response.data;
                    let header = response.headers();
                    authInfo.jwtToken = header['authorization'];


                    let debugJWT = true;
                    //if (debugJWT) {
                    if (true) {
                        console.log("username: " + authInfo.username);
                        console.log("roles: " + JSON.stringify(authInfo.authorities));
                        console.log("jwtToken: " + authInfo.jwtToken);
                        console.log("userType: " + authInfo.userRole);
                    }
                    AuthFactory.setJWTAuthInfo(authInfo);
                    sessionStorage.setItem('authInfo',JSON.stringify(authInfo));

                    let userLog = localStorage.getItem(authInfo.username);

                   if(userLog === null || userLog === undefined) {
                        localStorage.setItem(authInfo.username, JSON.stringify(authInfo.username));
                        $state.go("dashboard.home");
                    }else{
                        authInfo = null;
                        ToasterNotifierHandler.showErrorToast('user already logged');
                       sessionStorage.setItem('authInfo',null);
                    }
                }

                function errorCB(response) {
                    let error = response.data;
                    if (error && error.status === 401) {
                        ctrl.authMessage = error.message;
                    }
                    else {
                        ctrl.authMessage = 'No response from server';
                    }
                }

            }

        }


    ]);