'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LoginCtrl
 */



mainAngularModule
    .controller('LoginCtrl', ['$scope', '$state', 'AuthFactory','ToasterNotifierHandler',
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
                console.log("sending login");
                AuthFactory.sendLogin(ctrl.authRequest, successCB, errorCB);
                console.log("sended login");


                function successCB(response) {
                    console.log("success login");
                    let authInfo = response.data;


                    let header = response.headers();
                    console.log("retrieved data: " + JSON.stringify(response));
                    authInfo.jwtToken = header['authorization'];

                    let debugJWT = true;
                    if (true) {
                        console.log(authInfo);
                        console.log("username: " + authInfo.username);
                        console.log("roles: " + JSON.stringify(authInfo.authorities.authority));
                        console.log("jwtToken: " + authInfo.jwtToken);
                        console.log("userType: " + authInfo.userRole);
                        console.log("ended.");
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
                    console.log("error login");
                    console.log("errorCB: " + JSON.stringify(response.data));
                    console.log("error status: " + JSON.stringify(response.data.status));
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