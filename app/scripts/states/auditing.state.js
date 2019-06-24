'use strict';

mainAngularModule.config([
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('auditing', {
                abstract: true,
                url: '/auditing',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                },
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission('auditing');
                    }
                }
            })
            .state('auditing.logs', {
                url: '/logs',
                templateUrl: 'views/logs/auditing-logs.html',
                controller: 'AuditingLogController',
                controllerAs: 'ctrl'
            });
    }]
);