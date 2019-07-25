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




            /********************************************************************
             * QUANDO L'UTENTE SI CONNETTE, SALVO LE INFORMAZIONI DI SESSIONE   *
             * ALL'INTERNO DEL SESSION STORAGE CON LA KEY 'authInfo'. PRIMA     *
             * DELL'AUTENTICAZIONE, RECUPERO QUESTO PARAMETRO DAL SESSION       *
             * STORAGE: SE NON È NULL, L'UTENTE NON DOVRÀ RILOGGARSI MA VERRÀ   *
             * REINDIRIZZATO ALLA DASHBOARD. SE NON È NULL, L'UTENTE NON È      *
             * LOGGATO IN QUELLA SCHEDA E DOVRÀ QUINDI EFFETTUARE IL LOGIN      *
             ********************************************************************/




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

                    /*SALVO ALL'INTERNO DEL SESSION STORAGE LE INFORMAZIONI DELLA SESSIONE DELL'UTENTE*/

                    sessionStorage.setItem('authInfo',JSON.stringify(authInfo));

                    let userLog = localStorage.getItem(authInfo.username);


                    /**************************************************************************
                    * SE NEL LOCAL STORAGE NON È PRESENTE LO USERNAME DELL'UTENTE, SIGNIFICA  *
                    * CHE QUESTO NON È CONNESSO AL SISTEMA: PUÒ QUINDI EFFETTUARE IL LOGIN.   *
                    * SE È GIÀ PRESENTE, L'UTENTE È GIÀ CONNESSO IN UN'ALTRA SCHEDA E NON PUÒ *
                    * QUINDI RILOGGARSI.                                                      *
                    *                                                                         *
                    ****************************************************************************/


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