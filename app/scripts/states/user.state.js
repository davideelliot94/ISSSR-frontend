'use strict';
var stateUserCreate='user.create';
var stateUserList='user.list';
var stateUserInfo='user.info';
var stateUserPermission='user.permission';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {


$stateProvider
    .state('user', {
        abstract: true,
        url: '/user',
        templateUrl: 'views/dashboard/main.html',
        data: {
            requiresLogin: true
        }
    })
    .state(stateUserList, {
        url: '/list',
        templateUrl: 'views/user/user-list.html',
        controller: 'UserListCtrl',
        controllerAs: 'ctrl',
        resolve: {
            acl: function (AclRouteProtector) {
                return AclRouteProtector.checkRoutePermission(stateUserList);
            }
        }
    })
    .state(stateUserInfo, {
        url: '/{userId: int}/info',
        templateUrl: 'views/user/user-info.html',
        controller: 'UserInfoController',
        controllerAs: 'ctrl',
        resolve: {
            acl: function (AclRouteProtector) {
                return AclRouteProtector.checkRoutePermission(stateUserInfo);
            }
        }
    })
    .state(stateUserCreate, {
        url: '/create',
        templateUrl: 'views/user/user-create.html',
        controller: 'UserCreateCtrl',
        controllerAs: 'ctrl',
        resolve: {
            acl: function (AclRouteProtector) {
                return AclRouteProtector.checkRoutePermission(stateUserCreate);
            }
        }
    })
    .state(stateUserPermission, {
        url: '/permission',
        templateUrl: 'views/user/user-permissions.html',
        controller: 'UserPermissionController',
        controllerAs: 'ctrl',
        resolve: {
            acl: function (AclRouteProtector) {
                return AclRouteProtector.checkRoutePermission(stateUserPermission);
            }
        }
    })
    }]);