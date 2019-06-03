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

                ctrl.currentSprint = {};

                console.log("SprintCreate");
                getFields();

                //prende i metadati che li servono con una get
                function getFields() {
                    let authInfo = AuthFactory.getAuthInfo();
                    SprintCreateDataFactory.getMetadata(authInfo.userId, function (response) {

                        console.log('targets', response.data);
                        ctrl.targets = response.data;
                        // ctrl.max_sprint_duration = response.headers()['MAX_ALLOWED_SPRINT_DURATION'];
                        ctrl.max_sprint_duration = 5;           //TODO HEADER GET
                        ctrl.durationsAvaibles=Array.from(Array(ctrl.max_sprint_duration).keys())
                        console.log( 'SprintCreateMAXDURATION' ,ctrl.max_sprint_duration);

                    }, function () {
                        alert("Invalid metadata");
                    });
                }


                function resetFieldsFn() {
                    console.log('reset ticket form');
                    //inseriamo l'id del PO

                    ctrl.userInfo = AuthFactory.getAuthInfo();

                }

                //questa funzione cerca di inserire i ticket, i campi lo prende dalla view.
                //se la post ha successo faccio resetFieldsFn e visualizzo un'altra pagina
                //altrimenti vado alla pagina di errore.
                function insertSprintFn() {
                    console.log('insert sprint', ctrl.currentSprint, ctrl.targets);



                    ctrl.currentSprint.duration = ctrl.duration;
                    ctrl.currentSprint.idProduct=ctrl.selectedTarget; //setting just the id

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

                            $state.go('scrum.sprints_view');
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