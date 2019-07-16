'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp 
 */
mainAngularModule
    .controller('MainCtrl', function ($scope, $position,$window,AuthFactory) {

        /***************************************************************************
        * ALL'INTERNO DEL MainCtrl, IN CASO DI CHIUSURA DELLA FINESTRA DEL BROWSER *
        * ELIMINO I DATI DI SESSIONE DELL'UTENTE, E RIMUOVO IL SUO USERNAME DAL    *
        *  LOCALSTORAGE PER INDICARE CHE NON È PIÙ CONNESSO                        *
        ****************************************************************************/



        $window.onbeforeunload = function (event) {
            localStorage.removeItem(AuthFactory.getAuthInfo().username);

        }

    });
