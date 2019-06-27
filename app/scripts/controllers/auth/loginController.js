'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LoginCtrl
 */
mainAngularModule
    .controller('LoginCtrl', ['$scope', '$state', 'AuthFactory','ToasterNotifierHandler',  'BacklogItemService',
        function ($scope, $state, AuthFactory,ToasterNotifierHandler) {

            let ctrl = this;
            let authInfo = JSON.parse(sessionStorage.getItem("authInfo"));

            //check if user already logged in session
            if(authInfo !== null && authInfo !== undefined){
                AuthFactory.retrieveJWTAuthInfo(authInfo);
                $state.go("dashboard.home");

            }


            ctrl.authRequest = {username: 'admin', password: 'password'};
            ctrl.doLogin = doLoginFn;
            ctrl.authMessage = '';

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

                    sessionStorage.setItem("authInfo",JSON.stringify(authInfo));

                    let userL = localStorage.getItem(authInfo.username);

                    console.log("userL: " + userL);
                    if(userL !== null && userL !== undefined){
                        ToasterNotifierHandler.showErrorToast("User already logged in another tab");
                    }

                    else {
                        localStorage.setItem(authInfo.username,authInfo.username);
                        AuthFactory.setJWTAuthInfo(authInfo);
                        $state.go("dashboard.home");
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