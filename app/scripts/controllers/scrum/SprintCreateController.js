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
        'SprintCreateCtrl',
        ['$scope', '$state', 'AuthFactory', 'UserDataFactory', 'SprintCreateDataFactory', 'softwareProductDataFactory', 'ErrorStateRedirector',
            function ($scope, $state, AuthFactory, UserDataFactory, SprintCreateDataFactory, softwareProductDataFactory, ErrorStateRedirector) {
                const ctrl = this;

                ctrl.targets ={
                    id: 1
                };
                getFields();



                //prende i metadati che li servono con una get
                function getFields() {
                    SprintCreateDataFactory.getMetadata(ctrl.currentSprint.productOwnerId, function (response) {

                        console.log('targets', response.data);
                        ctrl.targets = response.data.activeTargets;
                        ctrl.max_sprint_duration = response.data.max_duration;
                    }, function () {
                        alert("Invalid metadata");
                    });
                }


                function resetFieldsFn() {
                    console.log('reset ticket form');
                    //inseriamo l'id del PO
                    ctrl.currentSprint = {
                        productOwnerId: ctrl.userInfo.userId
                    };
                    ctrl.userInfo = AuthFactory.getAuthInfo();

                }

                //questa funzione cerca di inserire i ticket, i campi lo prende dalla view.
                //se la post ha successo faccio resetFieldsFn e visualizzo un'altra pagina
                //altrimenti vado alla pagina di errore.
                function insertSprintFn() {
                    console.log('insert sprint', ctrl.currentSprint, ctrl.targets);
                    SprintCreateDataFactory.Insert(
                        ctrl.currentSprint,
                        function (response) {
                            console.log(response);
                            resetFieldsFn();
                            /*
                            if (ctrl.userInfo.userRole === 'TEAM_MEMBER') {
                                $state.go('ticket.list', {}, {reload: 'ticket.list'});
                            } else if (ctrl.userInfo.userRole === 'CUSTOMER') {
                                $state.go('ticket.customer', {}, {reload: 'ticket.customer'});
                            }  else if (ctrl.userInfo.userRole === 'ADMIN') {
                                $state.go('ticket.list', {}, {reload: 'ticket.list'});
                            }
                            */
                             //TODO visulizzazione successiva sprint attivi
                        }, function (response) {
                            console.error(response);
                            ErrorStateRedirector.GoToErrorPage({Messaggio: 'Errore nella creazione dello sprint'});
                        });
                }



                function init() {
                    ctrl.userInfo = AuthFactory.getAuthInfo();

                    resetFieldsFn();
                    //populateProductSoftwareListFn();

                    // Popola costanti per le ng-option
                    //populateTicketCategoriesFn();
                    //populateTicketCustomerPrioritiesFn();
                }


                ctrl.resetFields = resetFieldsFn;
                ctrl.insertSprint = insertSprintFn;

                init();

            }]);