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
        ['$scope', '$state', '$stateParams','AuthFactory', 'UserDataFactory', 'SprintCreateDataFactory', 'softwareProductDataFactory', 'ErrorStateRedirector', '$sessionStorage',
            function ($scope, $state,$stateParams, AuthFactory, UserDataFactory, SprintCreateDataFactory, softwareProductDataFactory, ErrorStateRedirector, $sessionStorage) {
                const ctrl = this;

                ctrl.currentSprint = {};

                console.log("SprintCreate");


                //prende i metadati che li servono con una get



                function resetFieldsFn() {
                    console.log('reset ticket form');
                    //inseriamo l'id del PO
                    ctrl.max_sprint_duration = 5;           //TODO HEADER GET
                    ctrl.durationsAvaibles=[1,2,3,4];
                    ctrl.userInfo = AuthFactory.getAuthInfo();

                }

                // i campi lo prende dalla view.
                //se la post ha successo faccio resetFieldsFn e visualizzo un'altra pagina
                //altrimenti vado alla pagina di errore.
                function insertSprintFn() {
                    console.log('insert sprint', ctrl.currentSprint, $stateParams.target);

                    ctrl.currentSprint.duration = ctrl.duration;
                    ctrl.currentSprint.idProduct= ctrl.target.id;
                    SprintCreateDataFactory.Insert(
                        ctrl.currentSprint,
                        function (response) {
                            console.log(response);
                            resetFieldsFn();

                            $state.go('sprint.selectTargetForCreate', {target: ctrl.target}); //TODO link to sprint backlog insert??
                        }, function (response) {
                            console.error(response);
                            let msgErr = 'Errore nella creazione dello sprint';
                            if(response.data === "expiration"){
                                msgErr = "Login session expired"
                            }
                            ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});
                        });
                }



                function init() {
                    ctrl.userInfo = AuthFactory.getAuthInfo();
                    ctrl.target = JSON.parse(sessionStorage.getItem('target'));
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