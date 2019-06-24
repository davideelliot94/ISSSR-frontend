'use strict';

mainAngularModule.config([
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('acl', {
                abstract: true,
                url: '/record',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                },
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission('acl');
                    }
                }
            })
            .state('acl.logs', {
                controller: 'AclRecordsController',
                controllerAs: 'ctrl',
                url: '/log',
                templateUrl: 'views/logs/acl-records.html'
            });
    }]
);