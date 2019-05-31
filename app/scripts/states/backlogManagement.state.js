'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('backlog_management', {
                abstract: true,
                url: '/backlog_management',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })
            .state('backlog_management.view', {
                url: '/view',
                controller:'backlogManagementController',
                templateUrl: 'views/scrum/backlogManagement.html',
                controllerAs: 'ctrl'
                //TODO mettere un resolve ?? per la gestione dei permessi
            });
    }]);