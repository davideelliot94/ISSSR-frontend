'use strict';

mainAngularModule.config(['$stateProvider', 'SCRUM_STATE',
    function ($stateProvider, SCRUM_STATE) {

        $stateProvider.state('sprint', {
            abstract: true,
            url: '/scrum/sprint',
            templateUrl: 'views/dashboard/main.html',
            data: {
                requiresLogin: true
            },
            resolve: {
                acl: function (AclProtector) {
                    return AclProtector.checkRoutePermission(SCRUM_STATE);
                }
            }

        }).state('sprint.create', {
            url: '/sprintCreateState',
            templateUrl: 'views/scrum/sprint-create.html',
            controller: 'SprintCreateCtrl',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclProtector) {
                    return AclProtector.checkRoutePermission(SCRUM_STATE);
                }
            }


        }).state('sprint.view', {
            url: '/sprintsViewByPO',
            templateUrl: 'views/scrum/sprints-view.html',
            controller: 'SprintsCtrl',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclProtector) {
                    return AclProtector.checkRoutePermission(SCRUM_STATE);
                }
            }

        }).state('sprint.viewSprintBacklog', {
            url: '/viewSprintBacklog',
            templateUrl: 'views/scrum/viewSprintBacklog.html',
            controller: 'viewSprintBacklogController',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclProtector) {
                    return AclProtector.checkRoutePermission(SCRUM_STATE);
                }
            }

        }).state('sprint.selectTargetForCreate', {
            url: '/sprintsCreateSelectProduct',
            templateUrl: 'views/scrum/sprints-view-byproduct.html',
            controller: 'SprintsPreCreateCtrl',
            controllerAs: 'ctrl',
            params: {
                target: null
            },
            resolve: {
                acl: function (AclProtector) {
                    return AclProtector.checkRoutePermission(SCRUM_STATE);
                }
            }
        });
    }]);