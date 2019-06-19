'use strict';

mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider.state('sprint', {
            abstract: true,
            url: '/scrum/sprint',
            templateUrl: 'views/dashboard/main.html',
            data: {
                requiresLogin: true
            }
        }).state('sprint.create', {
                url: '/sprintCreateState',
                templateUrl: 'views/scrum/sprint-create.html',
                controller: 'SprintCreateCtrl',
                controllerAs: 'ctrl',
                params: {
                    target: null
                }
                /*
                data: {
                    requiresLogin: true
                }

                 */
                //TODO fare il controllo se si tratta di Product Owner.
                /*resolve: {
                    acl: function (AclRouteProtector) {
                        return AclRouteProtector.checkRoutePermission('PO');
                    }
                }*/
            }).state('sprint.view', {
            url: '/sprintsViewByPO',
            templateUrl: 'views/scrum/sprints-view.html',
            controller: 'SprintsCtrl',
            controllerAs: 'ctrl',
        }).state('sprint.selectTargetForCreate', {
            url: '/sprintsCreateSelectProduct',
            templateUrl: 'views/scrum/sprints-view-byproduct.html',
            controller: 'SprintsPreCreateCtrl',
            controllerAs: 'ctrl',
        })
    }]);