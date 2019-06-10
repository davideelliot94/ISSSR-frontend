'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */

mainAngularModule
    .factory('AuthFactory', ['$state', '$http', 'BACKEND_BASE_URL', 'LOGIN_ENDPOINT_URL', 'authManager',
        '$sessionStorage', 'ToasterNotifierHandler', 'AclService',
        function ($state, $http, BACKEND_BASE_URL, LOGIN_ENDPOINT_URL, authManager, $sessionStorage, ToasterNotifierHandler, AclService) {

            var thisAuthService = {};

            var _endPointJSON = BACKEND_BASE_URL + LOGIN_ENDPOINT_URL;

           // thisAuthService.retriveSession = retrieveSessionFn;
            thisAuthService.sendLogin = sendLoginFn;
            thisAuthService.retrieveJWTAuthInfo = retrieveJWTAuthInfoFn;
            thisAuthService.setJWTAuthInfo = setJWTAuthInfoFn;
            thisAuthService.getJWTToken = getJWTTokenFn;
            thisAuthService.invalidateJWTToken = invalidateJWTTokenFN;
            thisAuthService.isAuthenticated = isAuthenticatedFn;
            thisAuthService.getAuthInfo = getAuthInfoFn;
            thisAuthService.deleteAuthInfo = deleteAuthInfoFn;


/*            function retrieveSessionFn(authInfo,successCB,errorCB) {
                $http({
                    method: 'POST',
                    url: _endPointJSON,
                    //skipAuthorization: true,
                    data: authInfo
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response);
                            }
                            //return response.data;
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }*/



            function sendLoginFn(authInfo, successCB, errorCB) {

                $http({
                    method: 'POST',
                    url: _endPointJSON,
                    //skipAuthorization: true,
                    data: authInfo
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response);
                            }
                            //return response.data;
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }


            function retrieveJWTAuthInfoFn(authInfo){

                $sessionStorage.put('authInfo', authInfo);
               authManager.authenticate();
               authInfo.authorities.forEach(function (a) {
                    AclService.attachRole(a.authority);
               })
            }


            function setJWTAuthInfoFn(authInfo) {
                $sessionStorage.put('authInfo', authInfo);
                authManager.authenticate();
                console.log("cristo 0 di authorities " + JSON.stringify(authInfo));
                console.log("cristo 1 di authorities " + JSON.stringify(authInfo.authorities));
                authInfo.authorities.forEach(function (a) {
                    console.log("aa = " + a.authority);
                    AclService.attachRole(a.authority);
                    console.log("aa2");
                })

            }

            function invalidateJWTTokenFN() {
                $sessionStorage.remove('authInfo');
                authManager.unauthenticate();
                AclService.flushRoles();
            }

            function isAuthenticatedFn() {
                console.log("isAuthenticated: ", authManager.isAuthenticated);
                return authManager.isAuthenticated;
            }

            function getJWTTokenFn() {
                let authinfo = $sessionStorage.get('authInfo');
                if (authinfo === undefined) {
                    return '';
                }
                return authinfo.jwtToken;
            }

            function getAuthInfoFn() {
                  let authInfo = $sessionStorage.get('authInfo');
                  if(authInfo !== null && authInfo !== undefined){
                      console.log("returning");
                      return authInfo;
                  }
                  console.log("null/undefined");
                  return $sessionStorage.get('authInfo');
                //return ite
            }

            function deleteAuthInfoFn() {
                invalidateJWTTokenFN();
                $state.go('login');
            }

            return thisAuthService;
        }]);

