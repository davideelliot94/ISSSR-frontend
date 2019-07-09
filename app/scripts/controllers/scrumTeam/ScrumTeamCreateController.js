'use strict';
/* Controller che gestisce la finestra di creazione di uno Scrum Team*/
mainAngularModule
    .controller('ScrumTeamCreateCtrl', ['$scope', '$state', 'ScrumTeamDataFactory', 'ErrorStateRedirector', '$location', '$anchorScroll', '$stateParams', 'UserDataFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        function ($scope, $state, ScrumTeamDataFactory, ErrorStateRedirector, $location, $anchorScroll, $stateParams, UserDataFactory) {

            let ctrl = this;
            ctrl.currentScrumTeam = {
                'name': null,
                'scrumMaster': null,
                'productOwner': null,
                'teamMembers': []
            };
            ctrl.assistantList = []; // lista delle persone registrate

            ctrl.value = true;

            /* Invocata in fase di inizializzazione per popolare correttamente la finestra mettendo gli utenti nei ruoli
             giusti, qualora fossero già stati assegnati */
            function mergeAssistantFn() {

                ctrl.assistantList.forEach(function (assistant) {
                    if (ctrl.currentScrumTeam.scrumMaster.id !== null && ctrl.currentScrumTeam.scrumMaster.id === assistant.id) {
                        let index = ctrl.assistantList.indexOf(assistant);
                        ctrl.assistantList.splice(index, 1);
                    }
                    if (ctrl.currentScrumTeam.productOwner.id !== null && ctrl.currentScrumTeam.productOwner.id === assistant.id) {
                        let index = ctrl.assistantList.indexOf(assistant);
                        ctrl.assistantList.splice(index, 1);
                    }
                });

                ctrl.currentScrumTeam.teamMembers.forEach(function (member) {
                    ctrl.assistantList.forEach(function (assistant) {
                        if (member.id === assistant.id) {
                            let index = ctrl.assistantList.indexOf(assistant);
                            ctrl.assistantList.splice(index, 1);
                        }
                    });
                });

            }

            /* Popola l'elenco dei candidati a far parte del team con gli utenti di tipo non CUSTOMER*/
            function getAllAssistantFn() {
                UserDataFactory.GetAllNotCustomer(function (assistants) {
                    ctrl.assistantList = assistants;//.filter(filterWhatNotAssistant);
                    mergeAssistantFn();
                }, function () {
                    ErrorStateRedirector.GoToErrorPage({Messaggio: 'Errore nel recupero dei membri'});
                });
            }

            function init() {
                getAllAssistantFn();
            }

            function resetFieldsFn() {

                ctrl.currentScrumTeam = {
                    'name': null,
                    'scrumMaster': null,
                    'productOwner': null,
                    'teamMembers': []
                };
                init();
            }


            resetFieldsFn();


            /* Invia al back-end una richiesta di inserimento dello Scrum Team costituito dai membri indicati*/
            function insertScrumTeamFn() {

                $scope.$on('someEvent', function(event, data) {
                    console.log(data); });


                ScrumTeamDataFactory.Insert(ctrl.currentScrumTeam,
                    function () {
                        // In caso di successo viene ricaricata la pagina di visualizzazione Scrum Team
                        resetFieldsFn();
                        $state.go('scrumteam.view');
                    }, function (response) {
                        // In caso di errore, avviene un redirezionamento verso la pagina di errore
                        let msgErr = 'Errore nell\'inserimento dello scrum team';
                        if(response.data === 'expiration'){
                            msgErr = 'Login session expired';
                        }
                        ErrorStateRedirector.GoToErrorPage({Messaggio: msgErr});
                    });
            }

            init();

            function setCurrentScrumTeam() {
                ScrumTeamDataFactory.GetCompleteTeam($stateParams.teamId, function (completeTeam) {
                    ctrl.currentScrumTeam = completeTeam;
                    getAllAssistantFn();
                }, function () {
                    ErrorStateRedirector.GoToErrorPage({Messaggio: 'Errore nel recupero dello scrum team'});
                });
            }


            function changeStateFn() {
                if (ctrl.value) {
                    ctrl.value = false;
                } else {
                    ctrl.value = true;
                }
            }

            /* Setta l'utente scelto come Scrum Master rimuovendolo dalla lista dei candidati*/
            function setScrumMasterFn(member) {
                changeStateFn();

                ctrl.currentScrumTeam.scrumMaster = member;
                let index = ctrl.assistantList.indexOf(member);
                ctrl.assistantList.splice(index, 1);
            }

            /* Reimmette nella lista dei candidati l'utente settato come scrum master rimuovendolo dall'incarico*/
            function unsetScrumMasterFn() {
                changeStateFn();
                ctrl.assistantList.push(ctrl.currentScrumTeam.scrumMaster);
                ctrl.currentScrumTeam.scrumMaster = null;
            }

            /* Setta l'utente scelto come Product Owner rimuovendolo dalla lista dei candidati*/
            function setProductOwnerFn(member) {
                changeStateFn();

                ctrl.currentScrumTeam.productOwner = member;
                let index = ctrl.assistantList.indexOf(member);
                ctrl.assistantList.splice(index, 1);
            }

            /* Reimmette nella lista dei candidati l'utente settato come Product Owner rimuovendolo dall'incarico*/
            function unsetProductOwnerFn() {
                changeStateFn();
                ctrl.assistantList.push(ctrl.currentScrumTeam.productOwner);
                ctrl.currentScrumTeam.productOwner = null;
            }

            /* Setta l'utente scelto come teamMember rimuovendolo dalla lista dei candidati*/
            function setTeamMemberFn(member) {
                ctrl.currentScrumTeam.teamMembers.push(member);

                let index = ctrl.assistantList.indexOf(member);
                ctrl.assistantList.splice(index, 1);

            }

            /* Reimmette nella lista dei candidati l'utente settato come team member rimuovendolo dall'incarico*/
            function unsetTeamMemberFn(member) {

                ctrl.assistantList.push(member);
                let index = ctrl.currentScrumTeam.teamMembers.indexOf(member);
                ctrl.currentScrumTeam.teamMembers.splice(index, 1);
            }

            ctrl.getAllAssistant = getAllAssistantFn;
            ctrl.setScrumMaster = setScrumMasterFn;
            ctrl.setProductOwner = setProductOwnerFn;
            ctrl.unsetScrumMaster = unsetScrumMasterFn;
            ctrl.unsetProductOwner = unsetProductOwnerFn;
            ctrl.setTeamMember = setTeamMemberFn;
            ctrl.unsetTeamMember = unsetTeamMemberFn;
            ctrl.resetFields = resetFieldsFn;
            ctrl.resetFields = resetFieldsFn;
            ctrl.insertScrumTeam = insertScrumTeamFn;

        }

    ]);