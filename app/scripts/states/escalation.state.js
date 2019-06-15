'use strict';
var stateEscalationNew='escalation.new';
var stateEscalationQueue='escalation.queue';
mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('escalation', {
                abstract: true,
                url: '/escalation',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })
            .state(stateEscalationNew, {
                url: '/defineEscalation',
                controller:"ctrlEscalation",
                templateUrl: "views/planning/defineEscalation.html",
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateEscalationNew);
                    }
                }
            })
            .state(stateEscalationQueue, {
                controller:"ctrlQueue",
                url: '/showQueue',
                templateUrl: "views/planning/showQueue.html",
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateEscalationQueue);
                    }
                }
            })
    }]);