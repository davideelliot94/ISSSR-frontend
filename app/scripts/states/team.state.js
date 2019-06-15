'use strict';
var stateTeamList='team.list';
var stateTeamCreate='team.create';
var stateTeamEdit='team.edit';
var stateTeamAssign='team.assign';
mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('team', {
                abstract: true,
                url: '/team',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })
            .state(stateTeamList, {
                url: '/list',
                templateUrl: 'views/team/team-list.html',
                controller: 'TeamListCtrl',
                controllerAs: 'ctrl',
                data: {
                    requiresLogin: true
                }
                ,
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateTeamList);
                }
            }
            })
            .state(stateTeamCreate, {
                url: '/create',
                templateUrl: 'views/team/team-create.html',
                controller: 'TeamCreateCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateTeamCreate);
                    }
                }
            })
            .state(stateTeamEdit, {
                url: '/{teamId:int}/edit',
                templateUrl: 'views/team/team-edit.html',
                controller: 'TeamEditCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateTeamEdit);
                    }
                }
            })
            .state(stateTeamAssign, {
                url: '/{teamId:int}/assign',
                templateUrl: 'views/team/team-assign.html',
                controller: 'TeamAssignCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateTeamAssign);
                    }
                }
            })

    }]);