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
        $window.onbeforeunload = function (event) {
            localStorage.removeItem(AuthFactory.getAuthInfo().username);

        }

    });
