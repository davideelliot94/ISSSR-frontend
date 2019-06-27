'use strict';

mainAngularModule
    .controller('GroupListController', ['$scope', '$state', 'GroupDataFactory', 'PermissionDataFactory', 'ErrorStateRedirector', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        function ($scope, $state, GroupDataFactory, PermissionDataFactory, ErrorStateRedirector, DTOptionsBuilder, DTColumnDefBuilder) {

            var ctrl = this;
            ctrl.groups = {};

            ctrl.showGroups = showGroupsFn;
            ctrl.refreshGroups = refreshGroupsFn;
            ctrl.deleteGroup = deleteGroupFn;

            refreshGroupsFn();
            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(2).notSortable()
            ];

            function showGroupsFn() {
                GroupDataFactory.GetAll(
                    function (groups) {
                        ctrl.groups = groups;
                    }, function (error) {
                        let msgErr = "Errore nel recupero dei gruppi";
                        if(response.data === "expiration"){
                            msgErr = "Login session expired"
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr})
                    });
            }

            function refreshGroupsFn() {
                ctrl.showGroups();
            }

            function deleteGroupFn(idGroup) {
                GroupDataFactory.Remove(
                    idGroup,
                    function () {
                        refreshGroupsFn()
                    }, function () {
                        let msgErr = "Errore nell'eliminazione del gruppo";
                        if(response.data === "expiration"){
                            msgErr = "Login session expired"
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr})
                    });
            }


        }]);