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
                    SprintCreateDataFactory.GetAllByProductOwner(authInfo.userId,
                        function (sprints) {
                            ctrl.sprints = sprints;
                            console.log("SprintsController", ctrl.sprints)
                        }, function (error) {
                            let msgErr = "Errore nel recupero degli Sprint";
                            if(error.data === "expiration"){
                                msgErr = "Login session expired"
                            }
                            ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});
                        });
                }

                function showSprintFn() {
                    //state.go dove viene mostrato i dettagli dello sprint.
                }

                $scope.closeSprint = function(sprint) {
                    console.log('close sprint');
                    SprintCreateDataFactory.closeSprint(sprint.id,
                        function () {
                            console.log("closed");
                            sprint.isActive = false;
                        }, function (error) {
                            let msgErr = "Errore nella chiusura dello SPrint";
                            if(error.data === "expiration"){
                                msgErr = "Login session expired"
                            }
                            ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});
                        });
                };

                ctrl.refreshSprints = refreshSprintsFn;
                ctrl.showSprint = showSprintFn;

                refreshSprintsFn();


            }])
;