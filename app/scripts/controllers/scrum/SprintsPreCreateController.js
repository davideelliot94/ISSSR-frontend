'use strict';
mainAngularModule
    .controller(
        'SprintsPreCreateCtrl',
        ['$scope', 'AuthFactory', 'SprintCreateDataFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ErrorStateRedirector', '$state', '$stateParams',
            function ($scope, AuthFactory, SprintCreateDataFactory, DTOptionsBuilder, DTColumnDefBuilder, ErrorStateRedirector, $state, $stateParams) {
                let ctrl = this;
                console.clear();
                console.log('ciao');
                ctrl.visualizeSprints = false;
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
                        ctrl.durationsAvaibles=Array.from(Array(ctrl.max_sprint_duration).keys())
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
                            console.log("SprintsController", ctrl.sprints);
                        }, function (error) {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nel recupero degli Sprint"});
                        });
                }

                function addSprintFn() {
                    sessionStorage.setItem('target', JSON.stringify(ctrl.selectedTarget));
                    console.log(JSON.parse(sessionStorage.getItem('target')));
                    $state.go('sprint.create');
                }

                function showSprintFn() {
                    //state.go dove viene mostrato i dettagli dello sprint.
                }

                function visualizeSprintsTriggerFn(){
                    populateSprintsFn();
                    ctrl.visualizeSprints = true;
                }

                ctrl.addSprint = addSprintFn;
                ctrl.populateSprints = populateSprintsFn;
                ctrl.showSprint = showSprintFn;
                ctrl.visualizeSprintsTrigger = visualizeSprintsTriggerFn;


                getFields();



            }]);