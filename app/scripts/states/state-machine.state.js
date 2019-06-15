'use strict';
var stateMachineCreate='state_machine.create';
var stateMachineDashboard='state_machine.dashboard';
mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('state_machine', {
                abstract: true,
                url: '/stateMachine',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })
            .state(stateMachineCreate, {
                templateUrl: 'views/createStateMachine/stateMachine.html',
                controller: 'createStateMachineCtrl',
                url: "/create",
                data: {
                    requiresLogin: true,
                    //access: ['Admin']
                },
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateMachineCreate);
                    }
                }
            })
            .state(stateMachineDashboard, {
                templateUrl: 'views/statemachine-dashboard/dashboard.html',
                controller: 'dashboardController',
                url: "/dashboard",
                data: {
                    requiresLogin: true,
                    //access: ['Admin']
                },
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateMachineDashboard);
                    }
                }
            })
    }]);