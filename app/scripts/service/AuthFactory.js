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

            // preleva dal back-end il file contenente i ruoli e le abilità di ognuno di essi
            function getPermissionFn(successCB, errorCB) {
                $http({
                    method: 'GET',
                    url: BACKEND_BASE_URL + '/public/perm',
                    skipAuthorization: true

                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response);
                            }

                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            ToasterNotifierHandler.handleError(response);
                        });

            }

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


            function setJWTAuthInfoFn(authInfo) {
                $sessionStorage.put('authInfo', authInfo);
                authManager.authenticate();
                authInfo.authorities.forEach(function (a) {
                    AclService.attachRole(a.authority);
                });

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
                return $sessionStorage.get('authInfo');
            }

            function deleteAuthInfoFn() {
                invalidateJWTTokenFN();
                $state.go('login');
            }

            thisAuthService.sendLogin = sendLoginFn;
            thisAuthService.setJWTAuthInfo = setJWTAuthInfoFn;
            thisAuthService.getJWTToken = getJWTTokenFn;
            thisAuthService.invalidateJWTToken = invalidateJWTTokenFN;
            thisAuthService.isAuthenticated = isAuthenticatedFn;
            thisAuthService.getAuthInfo = getAuthInfoFn;
            thisAuthService.deleteAuthInfo = deleteAuthInfoFn;
            thisAuthService.getPermission = getPermissionFn;

            return thisAuthService;
        }]);


