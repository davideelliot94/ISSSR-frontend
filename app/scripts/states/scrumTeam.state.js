'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('scrumTeam', {
                abstract: true,
                url: '/scrumteam',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })
            .state('scrumTeam.create', {
                url: '/create',
                templateUrl: 'views/scrumTeam/scrumteam-create.html',
                controller: 'ScrumTeamCreateCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclRouteProtector) {
                        return AclRouteProtector.checkRoutePermission('scrum_team_create');
                    }
                }
            })
            .state('scrumTeam.assign', {
                url: '/{scrumTeamId:int}/assign',
                templateUrl: 'views/scrumTeam/scrumTeam-assign.html',
                controller: 'ScrumTeamAssignCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclRouteProtector) {
                        return AclRouteProtector.checkRoutePermission('scrum_team_assign');
                    }
                }
            })


    }]);