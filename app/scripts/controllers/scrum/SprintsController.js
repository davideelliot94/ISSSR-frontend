'use strict';

mainAngularModule
    .controller(
        'SprintsCtrl',
        ['$scope', 'AuthFactory', 'SprintCreateDataFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ErrorStateRedirector', '$state',
            function ($scope, AuthFactory, SprintCreateDataFactory, DTOptionsBuilder, DTColumnDefBuilder, ErrorStateRedirector, $state) {
                let ctrl = this;

                $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
                $scope.dtColumnDefs = [
                    DTColumnDefBuilder.newColumnDef(3).notSortable(),
                    DTColumnDefBuilder.newColumnDef(4).notSortable()
                ];



                function refreshSprintsFn() {
                    console.log('refresh sprints');
                    let authInfo = AuthFactory.getAuthInfo();
                    SprintCreateDataFactory.GetAll(authInfo.userId,
                        function (sprints) {
                            ctrl.sprints = sprints;
                            console.log("SprintsController", ctrl.sprints)
                        }, function (error) {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nel recupero degli Sprint"});
                        });
                }

                function showSprintFn() {
                    //state.go dove viene mostrato i dettagli dello sprint.
                }

                ctrl.refreshSprints = refreshSprintsFn;
                ctrl.showSprint = showSprintFn;


                refreshSprintsFn();


            }]);