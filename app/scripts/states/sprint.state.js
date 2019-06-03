'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider.state('scrum', {
            abstract: true,
            url: '/scrum',
            templateUrl: 'views/dashboard/main.html',
            data: {
                requiresLogin: true
            }
        }).state('scrum.sprint_create_state', {
                url: '/sprintCreateState',
                templateUrl: 'views/scrum/sprint-create.html',
                controller: 'SprintCreateCtrl',
                controllerAs: 'ctrl',
                /*
                data: {
                    requiresLogin: true
                }

                 */
                //TODO fare il controllo se sitratta di Product Owner.
                /*resolve: {
                    acl: function (AclRouteProtector) {
                        return AclRouteProtector.checkRoutePermission('PO');
                    }
                }*/
            }).state('scrum.sprints_view', {
            url: '/sprints',
            templateUrl: 'views/scrum/sprints-view.html',
            controller: 'SprintsCtrl',
            controllerAs: 'ctrl',
        });
    }]);