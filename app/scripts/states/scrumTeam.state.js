'use strict';

mainAngularModule.config(['$stateProvider', 'SCRUM_STATE',
    function ($stateProvider, SCRUM_STATE) {

        $stateProvider
            .state('scrumteam', {
                abstract: true,
                url: '/scrumteam',
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

            .state('scrumteam.create', {
                url: '/create',
                templateUrl: 'views/scrumTeam/scrum-team-create.html',
                controller: 'ScrumTeamCreateCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(SCRUM_STATE);
                    }
                }
            })
            .state('scrumteam.burnDownChart', {
                url: '/{sprintId:int}/{productName:string}/{sprintNumber:int}/viewGraph',
                templateUrl: 'views/scrum/burnDownChart.html',
                controller: 'LineCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(SCRUM_STATE);
                    }
                }
            })
            .state('scrumteam.listassociate', {
                url: '/associate',
                templateUrl: 'views/scrum/productsoftware-list-associate.html',
                controller: 'ProductSoftwareListCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(SCRUM_STATE);
                    }
                }
        });
    }]);