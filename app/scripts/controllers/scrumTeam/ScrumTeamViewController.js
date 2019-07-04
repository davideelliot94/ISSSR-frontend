'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('ScrumTeamViewCtrl', ['$scope', '$state', 'softwareProductDataFactory', 'ErrorStateRedirector','$mdDialog' , 'DTOptionsBuilder', 'ScrumTeamDataFactory',
        function ($scope, $state, softwareProductDataFactory, ErrorStateRedirector, $mdDialog, DTOptionsBuilder,ScrumTeamDataFactory) {

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

            function deleteScrumTeamFn(scrumTeam) {
                ScrumTeamDataFactory.RemoveScrumTeam(scrumTeam.id, function () {
                    init();
                }, function (error) {
                    ErrorStateRedirector.GoToErrorPage({Messaggio: 'Errore nella cancellazione dello scrum Team'});
                });
            };


            ctrl.addScrumTeam = addScrumTeamFn;
            ctrl.deleteScrumTeam = deleteScrumTeamFn;
            ctrl.openViewMemberDialog = openViewMemberDialogFn;


            init();
    }]);



















