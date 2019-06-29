'use strict';

mainAngularModule.config(['$stateProvider', 'SCRUM_STATE',
    function ($stateProvider, SCRUM_STATE) {

        $stateProvider
            .state('scrum_ceremonies', {
                abstract: true,
                url: '/scrum_ceremonies',
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
            .state('scrum_ceremonies.view', {
                url: '/view',
                controller:'scrumCeremoniesController',
                templateUrl: 'views/scrum/scrumCeremoniesHistoryView.html',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(SCRUM_STATE);
                    }
                }
            });
    }]);