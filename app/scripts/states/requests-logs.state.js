'use strict';

mainAngularModule.config([
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('requestslogs', {
                abstract: true,
                url: '/requests_logs',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                },
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission('requestslogs');
                    }
                }
            })
            .state('requestslogs.list', {
                controller: 'RequestsLogsController',
                controllerAs: 'ctrl',
                url: '/list',
                templateUrl: 'views/logs/requests-logs.html'
            });
    }]
);