'use strict';

mainAngularModule.config(['$stateProvider', 'SCRUM_STATE', 'SCRUM_STATE_PLUS',
    function ($stateProvider, SCRUM_STATE, SCRUM_STATE_PLUS) {

        $stateProvider.state('scrum', {
            abstract: true,
            url: '/scrum',
            templateUrl: 'views/dashboard/main.html',
            data: { requiresLogin: true },
            resolve: {
                acl: function (AclProtector) {
                    return AclProtector.checkRoutePermission(SCRUM_STATE);
                }
            }

        }).state('scrum.sprint_create_state', {
            url: '/sprintCreateState',
            templateUrl: 'views/scrum/sprint-create.html',
            controller: 'SprintCreateCtrl',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclProtector) {
                    return AclProtector.checkRoutePermission(SCRUM_STATE);
                }
            }

        }).state('scrum.sprints_view', {
            url: '/sprints',
            templateUrl: 'views/scrum/sprints-view.html',
            controller: 'SprintsCtrl',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclProtector) {
                    return AclProtector.checkRoutePermission(SCRUM_STATE);
                }
            }

        }).state('scrum.product_workflow', {
            url: '/product_workflow',
            controller:'scrumProductWorkflowController',
            templateUrl: 'views/scrum/scrumProductWorkflow.html',
            controllerAs: 'ctrl',
            resolve: {
                acl: function (AclProtector) {
                    return AclProtector.checkRoutePermission(SCRUM_STATE_PLUS);
                }
            }
        });

    }]);