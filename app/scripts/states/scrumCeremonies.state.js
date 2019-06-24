'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('scrum_ceremonies', {
                abstract: true,
                url: '/scrum_ceremonies',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })
            .state('scrum_ceremonies.view', {
                url: '/view',
                controller:'scrumCeremoniesController',
                templateUrl: 'views/scrum/scrumCeremoniesHistoryView.html',
                controllerAs: 'ctrl'
                //TODO mettere un resolve ?? per la gestione dei permessi
            });
    }]);