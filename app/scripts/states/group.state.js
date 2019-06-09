'use strict';
var stateGroupList='group.list';
var stateGroupCreate='group.create';
var stateGroupEdit='group.edit';
var stateGroupDetails='group.details';
mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('group', {
                abstract: true,
                url: '/group',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            }).state(stateGroupList, {
            url: '/list',
            templateUrl: 'views/group/group-list.html',
            controller: 'GroupListController',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclRouteProtector) {
                    return AclRouteProtector.checkRoutePermission(stateGroupList);
                }
            }
        }).state(stateGroupCreate, {
            url: '/create',
            templateUrl: 'views/group/group-create.html',
            controller: 'GroupCreateController',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclRouteProtector) {
                    return AclRouteProtector.checkRoutePermission(stateGroupCreate);
                }
            }
        }).state(stateGroupEdit, {
            url: '/{groupId:int}/edit',
            templateUrl: 'views/group/group-edit.html',
            controller: 'GroupEditController',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclRouteProtector) {
                    return AclRouteProtector.checkRoutePermission(stateGroupEdit);
                }
            }
        }).state(stateGroupDetails, {
            url: '/details/{groupId}',
            templateUrl: 'views/group/group-details.html',
            controller: 'GroupHandlerController',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclRouteProtector) {
                    return AclRouteProtector.checkRoutePermission(stateGroupDetails);
                }
            }
        })

    }]);