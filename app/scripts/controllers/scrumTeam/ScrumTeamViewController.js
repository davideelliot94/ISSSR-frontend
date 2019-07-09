'use strict';
/* Controller che gestisce la finestra di visualizzazione degli Scrum Team*/
mainAngularModule
    .controller('ScrumTeamViewCtrl', ['$scope', '$state', 'softwareProductDataFactory', 'ErrorStateRedirector','$mdDialog','DTOptionsBuilder', 'ScrumTeamDataFactory', 'ToasterNotifierHandler',
        function ($scope, $state, softwareProductDataFactory, ErrorStateRedirector, $mdDialog, DTOptionsBuilder,ScrumTeamDataFactory, ToasterNotifierHandler) {

            // default option for datatable
            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');


            let ctrl = this;

            ctrl.currentScrumTeams = [];

            /* Al caricamento della pagina, si recupera la lista degli Scrum Team*/
            function init() {
                softwareProductDataFactory.GetScrumTeamList(
                    function successCallback(response) {
                        ctrl.currentScrumTeams = response;
                    }, function errorCallback(){
                        ToasterNotifierHandler.showErrorToast('Errore nel recupero degli Scrum Team');
                    });
            }

            /* Handler per il bottone che redireziona verso la finestra di creazione di un nuovo Scrum Team */
            function addScrumTeamFn() {
                $state.go('scrumteam.create');
            }

            /* Handler del pulsante per la visualizzazione del dialog contenente i dettagli su uno Scrum Team */
            function openViewMemberDialogFn(scrumTeam) {
                $mdDialog.show({
                    controller: 'ScrumTeamDialogController',
                    templateUrl: 'views/scrumTeam/scrum-team-dialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    // Passaggio dello Scrum Team selezionato
                    resolve: {
                        scrumTeam: function () {
                            return scrumTeam;
                        },

                    }
                });
            }

            /* Cancella uno Scrum Team*/
            function deleteScrumTeamFn(scrumTeam) {
                ScrumTeamDataFactory.RemoveScrumTeam(scrumTeam.id, function () {
                    init();
                }, function () {
                    ErrorStateRedirector.GoToErrorPage({Messaggio: 'Errore nella cancellazione dello scrum Team'});
                });
            }


            ctrl.addScrumTeam = addScrumTeamFn;
            ctrl.deleteScrumTeam = deleteScrumTeamFn;
            ctrl.openViewMemberDialog = openViewMemberDialogFn;


            init();
    }]);



















