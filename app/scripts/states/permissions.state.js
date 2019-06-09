'use strict';
var statePermissionTeam  ='permission.team';
var statePermissionTicket  ='permission.ticket';
var statePermissionProduct  ='permission.product';
var statePermissionGroup  ='permission.group';
mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('permissions', {
                abstract: true,
                url: '/permissions',
                templateUrl: 'views/dashboard/main.html',

                data: {
                    requiresLogin: true
                }
            }).state(statePermissionTeam, {
            url: '/{objectType}/team/{teamId}',
            templateUrl: 'views/permission/team-permission.html',
            controller: 'UserPermissionController',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclRouteProtector) {
                    return AclRouteProtector.checkRoutePermission(statePermissionTeam);
                }
            }
        }).state(statePermissionTicket, {
            url: '/{objectType}/ticket/{ticketId}',
            templateUrl: 'views/permission/ticket-permission.html',
            controller: 'UserPermissionController',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclRouteProtector) {
                    return AclRouteProtector.checkRoutePermission(statePermissionTicket);
                }
            }
        }).state(statePermissionProduct, {
            url: '/{objectType}/product/{productId}',
            templateUrl: 'views/permission/product-permission.html',
            controller: 'UserPermissionController',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclRouteProtector) {
                    return AclRouteProtector.checkRoutePermission(statePermissionProduct);
                }
            }
        }).state(statePermissionGroup, {
            url: '/{objectType}/group/{groupId}',
            templateUrl: 'views/permission/group-permission.html',
            controller: 'UserPermissionController',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclRouteProtector) {
                    return AclRouteProtector.checkRoutePermission(statePermissionGroup);
                }
            }
        }).state('permissions.details', {
            url: '/details/{sid}/{tipo}/{idTipo}',
            templateUrl: 'views/permission/permission-details.html',
            controller: 'PermissionHandlerController',
            controllerAs: 'ctrl'
        }).state('permissions.create', {
            url: '/details/{tipo}/',
            templateUrl: 'views/permission/permission-create.html',
            controller: 'PermissionHandlerController',
            controllerAs: 'ctrl'
        });
    }]);