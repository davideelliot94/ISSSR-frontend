'use strict';
var stateTicketList='ticket.list';
var stateTicketCreate='ticket.create';
mainAngularModule.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('ticket', {
                abstract: true,
                url: '/ticket',
                templateUrl: 'views/dashboard/main.html',
                data: {
                    requiresLogin: true
                }
            })
            .state(stateTicketList, {
                url: '/list',
                templateUrl: 'views/ticket/ticket-list.html',
                controller: 'TicketListCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateTicketList);
                    }
                }
            })
            .state(stateTicketCreate, {
                url: '/create',
                templateUrl: 'views/ticket/ticket-create.html',
                controller: 'TicketCreateCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    acl: function (AclProtector) {
                        return AclProtector.checkRoutePermission(stateTicketCreate);
                    }
                }
            })
            .state('ticket.update', {
                url: '/{ticketId:int}/update',
                templateUrl: 'views/ticket/ticket-update.html',
                controller: 'TicketUpdateCtrl',
                controllerAs: 'ctrl',
            })
            .state('ticket.ofCurrentAssistant', {
                url: '/ofCurrentAssistant',
                templateUrl: 'views/ticket/ticket-list-acquired.html',
                controller: 'TicketListOfCurrentAssistantCtrl',
                controllerAs: 'ctrl'
            })
            .state('ticket.edit', {
                url: '/{ticketId: int}/edit',
                templateUrl: 'views/ticket/ticket-edit.html',
                controller: 'TicketEditCtrl',
                controllerAs: 'ctrl'
            })
            .state('ticket.customer', {
                url: '/customer',
                templateUrl: 'views/ticket/ticket-list-customer.html',
                controller: 'TicketListCustomerCtrl',
                controllerAs: 'ctrl',
            });
    }]);