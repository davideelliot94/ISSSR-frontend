'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
mainAngularModule
    .directive('headerNotification', ['AuthFactory', function (AuthFactory) {
        return {
            templateUrl: 'scripts/directives/header/header-notification/header-notification.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope) {

                $scope.currentUser = AuthFactory.getAuthInfo();

                $scope.selectedMenu = 'dashboard';
                $scope.Logout = LogoutFn;

                function LogoutFn() {
                    let logUs = localStorage.getItem(AuthFactory.getAuthInfo().username);
                    console.log("was logged user: " + logUs);
                    sessionStorage.removeItem("authInfo");
                    localStorage.removeItem(AuthFactory.getAuthInfo().username);
                    AuthFactory.deleteAuthInfo();
                }
            }
        }
    }]);


