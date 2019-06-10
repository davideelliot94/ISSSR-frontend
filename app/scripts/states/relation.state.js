'use strict';
var stateRelationNew ="relation.new";
var stateRelationCreate ="relation.create";
var stateRelationView ="relation.view";
mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('relation', {
                abstract: true,
                url: '/relation',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })
            .state(stateRelationNew, {
                url: '/defineNewRelation',
                templateUrl: "views/planning/defineNewRelation.html",
                controller: "ctrlNewRelation",
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclRouteProtector) {
                        return AclRouteProtector.checkRoutePermission(stateRelationNew);
                    }
                }
            })
            .state(stateRelationCreate, {
                controller:"ctrlRelation",
                url: '/createNewRelation',
                templateUrl: 'views/planning/relation.html',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclRouteProtector) {
                        return AclRouteProtector.checkRoutePermission(stateRelationCreate);
                    }
                }
            })
            .state(stateRelationView, {
                templateUrl:"views/planning/dialog1.tmpl.html",
                url: '/relationview',
                resolve: {
                    acl: function (AclRouteProtector) {
                        return AclRouteProtector.checkRoutePermission(stateRelationView);
                    }
                }
            })
    }]);