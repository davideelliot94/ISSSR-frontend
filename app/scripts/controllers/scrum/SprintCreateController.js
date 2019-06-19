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
        ['$scope', '$state', '$stateParams','AuthFactory', 'UserDataFactory', 'SprintCreateDataFactory', 'softwareProductDataFactory', 'ErrorStateRedirector',
            function ($scope, $state,$stateParams, AuthFactory, UserDataFactory, SprintCreateDataFactory, softwareProductDataFactory, ErrorStateRedirector) {
                const ctrl = this;

                ctrl.currentSprint = {};

                console.log("SprintCreate");


                //prende i metadati che li servono con una get



                function resetFieldsFn() {
                    console.log('reset ticket form');
                    //inseriamo l'id del PO
                    ctrl.max_sprint_duration = 5;           //TODO HEADER GET
                    ctrl.durationsAvaibles=Array.from(Array(ctrl.max_sprint_duration).keys())
                    ctrl.userInfo = AuthFactory.getAuthInfo();

                }

                // i campi lo prende dalla view.
                //se la post ha successo faccio resetFieldsFn e visualizzo un'altra pagina
                //altrimenti vado alla pagina di errore.
                function insertSprintFn() {
                    console.log('insert sprint', ctrl.currentSprint, $stateParams.target);

                    ctrl.currentSprint.duration = ctrl.duration;
                    ctrl.currentSprint.idProduct= $stateParams.target.id;
                    SprintCreateDataFactory.Insert(
                        ctrl.currentSprint,
                        function (response) {
                            console.log(response);
                            resetFieldsFn();

                            $state.go('sprint.view'); //TODO link to sprint backlog insert??
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