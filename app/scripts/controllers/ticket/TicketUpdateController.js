'use strict';

/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */

mainAngularModule
    .controller(
        'TicketUpdateCtrl',
        ['$scope', '$state', '$stateParams', 'AuthFactory', 'TicketDataFactory', 'ErrorStateRedirector', 'httpService', 'restService',
        function ($scope, $state, $stateParams, AuthFactory, TicketDataFactory, ErrorStateRedirector, httpService, restService) {

            var ctrl = this;

            setCurrentTicket();

            function setCurrentTicket() {
                TicketDataFactory.Function($stateParams.ticketId,
                    function (ticket) {
                        ctrl.currentTicket = ticket;
                        ctrl.userInfo = AuthFactory.getAuthInfo();
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: 'Errore nel recupero del Ticket'})
                    });

            }

        }]);
