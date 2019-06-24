'use strict';
mainAngularModule
    .controller(
        'SprintsPreCreateCtrl',
        ['$scope', 'AuthFactory', 'SprintCreateDataFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder',
            'ErrorStateRedirector', '$state', '$stateParams', '$mdDialog',
            function ($scope, AuthFactory, SprintCreateDataFactory, DTOptionsBuilder, DTColumnDefBuilder,
                      ErrorStateRedirector, $state, $stateParams, $mdDialog) {
                let ctrl = this;
                console.clear();
                ctrl.visualizeSprints = false;
                ctrl.sprints = {};
                //ctrl.selectedTarget = null;

                $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
                $scope.dtColumnDefs = [
                    DTColumnDefBuilder.newColumnDef(2).notSortable()

                ];



                //prende i metadati che li servono alla get
                function getFields() {
                    let authInfo = AuthFactory.getAuthInfo();
                    if($stateParams.target !== null) {
                        ctrl.selectedTarget = $stateParams.target;
                        ctrl.visualizeSprintsTrigger();
                    }
                    else {
                        ctrl.selectedTarget = null;
                    }

                    SprintCreateDataFactory.getMetadata(authInfo.userId, function (response) {

                        console.log('targets', response.data);
                        ctrl.targets = response.data;
                        //ctrl.max_sprint_duration = response.headers()['Max-Allowed-Sprint-Duration'];
                        ctrl.max_sprint_duration = 5;           //TODO HEADER GET
                        ctrl.durationsAvaibles=Array.from(Array(ctrl.max_sprint_duration).keys());
                        console.log( 'SprintCreateMAXDURATION' ,ctrl.max_sprint_duration);

                    }, function () {
                        alert("Invalid metadata");
                    });
                }


                function populateSprintsFn() {
                    console.log('refresh sprints');
                    let authInfo = AuthFactory.getAuthInfo();
                    console.clear();
                    console.log(ctrl.selectedTarget);
                    SprintCreateDataFactory.GetAllByProduct(ctrl.selectedTarget.id,
                        function (sprints) {
                            ctrl.sprints = sprints;
                            ctrl.setPlayableSprintNumber();
                            console.log('SprintsController', ctrl.sprints);
                        }, function (error) {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nel recupero degli Sprint"});
                        });
                }

                function addSprintFn() {
                    sessionStorage.setItem('target', JSON.stringify(ctrl.selectedTarget));
                    console.log(JSON.parse(sessionStorage.getItem('target')));
                    $state.go('sprint.create');
                }

                function visualizeSprintsTriggerFn(){
                    populateSprintsFn();
                    ctrl.visualizeSprints = true;
                }

                this.viewSprintBacklog = function(sprint) {
                    sessionStorage.setItem('product', JSON.stringify(ctrl.selectedTarget));
                    sessionStorage.setItem('sprint', JSON.stringify(sprint));
                    $state.go('sprint.viewSprintBacklog');
                };

                // Apertura di una finestra di dialogo per la visualizzazione del Burndown Chart
                this.viewBurndownChart = function(sprint) {
                    $mdDialog.show({
                        controller: 'LineCtrl',
                        templateUrl: 'views/scrum/burnDownChart.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        // Passaggio dello sprint selezionato
                        resolve: {
                            sprint: function () {
                                return sprint;
                            },
                            product: function () {
                                return ctrl.selectedTarget;
                            }
                        }
                    });
                };

                // Restituisce il numero minimo dello sprint non attivo che corrisponde a quello attivabile
                this.setPlayableSprintNumber = function (){

                    let minNumber = Number.MAX_SAFE_INTEGER;
                    for (let i = 0; i < ctrl.sprints.length; i++){
                        if (ctrl.sprints[i].isActive === true){
                            ctrl.playableSprintNumber = -1;
                            break;
                        }
                        if (ctrl.sprints[i].number < minNumber && ctrl.sprints[i].isActive === null){
                            minNumber = ctrl.sprints[i].number;
                            ctrl.playableSprintNumber = minNumber;
                        }
                    }


                };

                this.isFollowingSprint = function (sprint) {
                    if (sprint.number === ctrl.playableSprintNumber) {
                        return true;
                    }
                    return false;
                };

                function closeSprintFn (sprint) {
                    SprintCreateDataFactory.closeSprint(sprint.id,
                        function () {
                            sprint.isActive = false;
                            ctrl.populateSprints();
                        }, function () {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: 'Errore nella chiusura dello Sprint'});
                        });
                }

                function activateSprintFn (sprint) {
                    SprintCreateDataFactory.activateSprint(sprint.id,
                        function () {
                            sprint.isActive = true;
                            ctrl.populateSprints();
                        }, function () {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: 'Errore in fase di attivazione Sprint'});
                        });
                }

                ctrl.addSprint = addSprintFn;
                ctrl.populateSprints = populateSprintsFn;
                ctrl.visualizeSprintsTrigger = visualizeSprintsTriggerFn;
                ctrl.closeSprint = closeSprintFn;
                ctrl.activateSprint = activateSprintFn;

                getFields();




            }]);