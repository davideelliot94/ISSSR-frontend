'use strict';
var stateSoftwareProductList='productsoftware.list';
var stateSoftwareProductCreate='productsoftware.create';
var stateSoftwareProductEdit='productsoftware.edit';
mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('productsoftware', {
                abstract: true,
                url: '/productsoftware',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })
            .state(stateSoftwareProductList, {
                url: '/list',
                templateUrl: 'views/productsoftware/productsoftware-list.html',
                controller: 'ProductSoftwareListCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateSoftwareProductList);
                    }
                }
            })
            .state(stateSoftwareProductCreate, {
                url: '/create',
                templateUrl: 'views/productsoftware/productsoftware-create.html',
                controller: 'ProductSoftwareCreateCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateSoftwareProductCreate);
                    }
                }
            })
            .state(stateSoftwareProductEdit, {
                url: '/{spId:int}/edit',
                templateUrl: 'views/productsoftware/productsoftware-edit.html',
                controller: 'ProductSoftwareEditCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateSoftwareProductEdit);
                    }
                }
            });
    }]);