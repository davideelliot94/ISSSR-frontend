'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('UserListCtrl', ['$scope', '$state', 'UserDataFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ErrorStateRedirector',
        function ($scope, $state, UserDataFactory, DTOptionsBuilder, DTColumnDefBuilder, ErrorStateRedirector) {

            var ctrl = this;
            ctrl.refreshUsers = refreshUsersFn;
            ctrl.deleteUser = deleteUserFn;
            ctrl.showInfo = showInfoFn;
            ctrl.isAdmin = isAdminFn;
            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(6).notSortable()
            ];

            refreshUsersFn();

            function refreshUsersFn() {
                UserDataFactory.GetAll(
                    function (users) {
                        ctrl.users = users;
                    }, function (error) {
                        let msgErr = "Errore nell'import degli user";
                        if(error.data === "expiration"){
                            msgErr = "Login session expired"
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});

                    });
            }

            function deleteUserFn(id) {
                console.log("delete user with id: " + id);
                UserDataFactory.Remove(id,
                    function () {
                        refreshUsersFn();
                    }, function (error) {
                        let msgErr = "Errore nell'eliminazione dell'utente";
                        if(error.data === "expiration"){
                            msgErr = "Login session expired"
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});

                    });
            }

            function showInfoFn(id) {
                $state.go('user.info', {
                    userId: id
                });
            }

            function isAdminFn(userType) {
                return userType === 'ADMIN';
            }

        }]);