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
                templateUrl: 'views/scrumTeam/scrum-team-create.html',
                controller: 'ScrumTeamCreateCtrl',
                controllerAs: 'ctrl'
            })
            .state('scrumteam.burnDownChart', {
                url: '/{sprintId:int}/viewGraph',
                templateUrl: 'views/scrum/burnDownChart.html',
                controller: 'LineCtrl',
                controllerAs: 'ctrl'
            })
            .state('scrumteam.listassociate', {
            url: '/associate',
            templateUrl: 'views/scrum/productsoftware-list-associate.html',
            controller: 'ProductSoftwareListCtrl',
            controllerAs: 'ctrl'
        });
    }]);