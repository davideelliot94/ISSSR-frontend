'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('scrumteam', {
                abstract: true,
                url: '/scrumteam',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })

            .state('scrumteam.create', {
                url: '/create',
                templateUrl: 'views/team/scrum-team-create.html',
                controller: 'ScrumTeamCreateCtrl',
                controllerAs: 'ctrl'/*,
                resolve: {
                    acl: function (AclRouteProtector) {
                        return AclRouteProtector.checkRoutePermission('team_create');
                    }
                }*/
            })

            .state('scrumteam.assign', {
                url: '/{teamId:int}/assign',
                templateUrl: 'views/team/scrum-team-assign.html',
                controller: 'ScrumTeamAssignCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclRouteProtector) {
                        return AclRouteProtector.checkRoutePermission('team_assign');
                    }
                }
            })

    }]);