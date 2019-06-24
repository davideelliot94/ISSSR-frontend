'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('scrumteam', {
                abstract: true,
                url: '/scrumteam',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    gin: true
                }
            })

            .state('scrumteam.create', {
                url: '/create',
                templateUrl: 'views/scrumTeam/scrum-team-create.html',
                controller: ['ScrumTeamCreateCtrl','SessionCtrl.js'],
                controllerAs: ['ctrl','ctrl2'],
                resolve: {
                    acl: function (AclRouteProtector) {
                        console.log("AclRouteProtector");
                        return AclRouteProtector.checkRoutePermission('scrum_team_create');
                    }
                }
            })
    }]);