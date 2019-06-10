'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LoginCtrl
 */
mainAngularModule
    .controller('LoginCtrl', ['$scope', '$state', 'AuthFactory',
        function ($scope, $state, AuthFactory) {

            let ctrl = this;
            let response = localStorage.getItem("response");
            let response2 = JSON.parse(response);
           /* if(response2 !== null){
                console.log("response2 " + response2);
                console.log("data response2 " + response2.data);
            }*/

            ctrl.authRequest = {username: 'admin', password: 'password'};


            //check if user already logged
            if(response2 !== null && response2 !== undefined){
                let authInfo = response2.data;
                let debugJWT = true;
                console.log("authInfoRetr: " + JSON.stringify(authInfo));
                AuthFactory.retrieveJWTAuthInfo(authInfo);
                $state.go("dashboard.home");
            }


            ctrl.doLogin = doLoginFn;


            ctrl.authMessage = '';


            let sessionStorage_transfer = function(event) {
                if(!event) { event = window.event; } // ie suq
                if(!event.newValue) return;          // do nothing if no value to work with
                if (event.key === 'getSessionStorage') {
                    // another tab asked for the sessionStorage -> send it
                    localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
                    // the other tab should now have it, so we're done with it.
                } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
                    // another tab sent data <- get it
                    var data = JSON.parse(event.newValue);
                    for (var key in data) {
                        sessionStorage.setItem(key, data[key]);
                    }
                }
            };

// listen for changes to localStorage
            if(window.addEventListener) {
                window.addEventListener("storage", sessionStorage_transfer, false);
            } else {
                window.attachEvent("onstorage", sessionStorage_transfer);
            }




            function doLoginFn() {
                AuthFactory.sendLogin(ctrl.authRequest, successCB, errorCB);

                function successCB(response) {
                    let authInfo = response.data;
                    let header = response.headers();
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

                    localStorage.setItem("response",JSON.stringify(response));

                    AuthFactory.setJWTAuthInfo(authInfo);
                    $state.go("dashboard.home");
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