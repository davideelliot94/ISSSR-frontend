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


            console.log("myauthinfo: " + JSON.stringify(authInfo));
            if(authInfo !== null && authInfo !== undefined){
           //     $state.go('dashboard.home');
                console.log('already logged');

                AuthFactory.setJWTAuthInfo(authInfo);
                $state.go("dashboard.home");
            }


            function doLoginFn() {
                console.log("doLoginFn");
                AuthFactory.sendLogin(ctrl.authRequest, successCB, errorCB);

                function successCB(response) {
                    let authInfo = response.data;
                    let header = response.headers();
                    authInfo.jwtToken = header['authorization'];

                    console.log("authInfo", authInfo);
                    // AuthFactory.user.username = authInfo.username;
                    // AuthFactory.user.role = authInfo.role;
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

                    console.log('setting authinfo');
                    console.log('authinfo username: ' + authInfo.username);
                    let userLog = localStorage.getItem(authInfo.username);
                    //let userLog = localStorage.getItem('apapa');
                   if(userLog === null || userLog === undefined) {
                        localStorage.setItem(authInfo.username, JSON.stringify(authInfo.username));
                        console.log('going to dashboard');
                        $state.go("dashboard.home");
                    }else{
                        authInfo = null;
                        ToasterNotifierHandler.showErrorToast('user already logged');
                        //console.log('is null? ' + JSON.stringify(sessionStorage.getItem('authInfo')));
                       sessionStorage.setItem('authInfo',null);
                    }
                }

                function errorCB(response) {
                    let error = response.data;
                    if (error && error.status === 401) {
                        ctrl.authMessage = error.message;
                    }
                    else {
                        console.error(response);
                        ctrl.authMessage = 'No response from server';
                    }
                }

            }

        }


    ]);