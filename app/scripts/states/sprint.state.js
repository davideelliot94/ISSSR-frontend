'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider.state('sprint', {
                abstract: true,
                url: '/scrum/sprint',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true}

            }).state('sprint.create', {
                url: '/sprintCreateState',
                templateUrl: 'views/scrum/sprint-create.html',
                controller: 'SprintCreateCtrl',
                controllerAs: 'ctrl',

            }).state('sprint.view', {
                url: '/sprintsViewByPO',
                templateUrl: 'views/scrum/sprints-view.html',
                controller: 'SprintsCtrl',
                controllerAs: 'ctrl',

            }).state('sprint.viewSprintBacklog', {
                url: '/viewSprintBacklog',
                templateUrl: 'views/scrum/viewSprintBacklog.html',
                controller: 'viewSprintBacklogController',
                controllerAs: 'ctrl'

            }).state('sprint.selectTargetForCreate', {
                url: '/sprintsCreateSelectProduct',
                templateUrl: 'views/scrum/sprints-view-byproduct.html',
                controller: 'SprintsPreCreateCtrl',
                controllerAs: 'ctrl',
                params: {
                    target: null
                }
            });
    }]);