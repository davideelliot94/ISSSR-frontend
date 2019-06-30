'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('ScrumTeamViewCtrl', ['$scope', '$state', 'softwareProductDataFactory', 'ErrorStateRedirector','$mdDialog' , 'DTOptionsBuilder',
        function ($scope, $state, softwareProductDataFactory, ErrorStateRedirector, $mdDialog, DTOptionsBuilder) {

            // default option for datatable
            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');


            let ctrl = this;

            ctrl.currentScrumTeams = [];

            function init() {
                softwareProductDataFactory.GetScrumTeamList(
                    function successCallback(response) {
                        ctrl.currentScrumTeams = response;
                    }, function errorCallback(){
                        ToasterNotifierHandler.showErrorToast('Errore nel recupero degli Scrum Team');
                    });
            }

            function addScrumTeamFn() {
                $state.go('scrumteam.create');
            }

            function openViewMemberDialogFn(scrumTeam) {
                $mdDialog.show({
                    controller: 'ScrumTeamDialogController',
                    templateUrl: 'views/scrumTeam/scrum-team-dialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    // Passaggio dello sprint selezionato
                    resolve: {
                        scrumTeam: function () {
                            return scrumTeam;
                        },

                    }
                });
            };


            ctrl.addScrumTeam = addScrumTeamFn;
            ctrl.openViewMemberDialog = openViewMemberDialogFn;


            init();
    }]);



















