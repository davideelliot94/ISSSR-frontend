'use strict';

mainAngularModule.config(['$stateProvider', 'SCRUM_STATE',
    function ($stateProvider, SCRUM_STATE) {

        $stateProvider
            .state('backlog_management', {
                abstract: true,
                url: '/backlog_management',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                },
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(SCRUM_STATE);
                    }
                }
            })
            .state('backlog_management.view', {
                url: '/view',
                controller:'backlogManagementController',
                templateUrl: 'views/scrum/backlogManagement.html',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(SCRUM_STATE);
                    }
                }
            });
    }]);