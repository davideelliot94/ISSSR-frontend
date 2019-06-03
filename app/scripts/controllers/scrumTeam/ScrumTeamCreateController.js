'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('ScrumTeamCreateCtrl', ['$scope', '$state', 'ScrumTeamDataFactory', 'ErrorStateRedirector', '$location', '$anchorScroll', '$stateParams', 'UserDataFactory', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        function ($scope, $state, ScrumTeamDataFactory, ErrorStateRedirector, $location, $anchorScroll, $stateParams, UserDataFactory, DTOptionsBuilder, DTColumnDefBuilder) {

            var ctrl = this;
            ctrl.currentScrumTeam = {
                "name": null,
                "scrumMaster": null,
                "productOwner": null,
                "teamMembers": []
            };
            ctrl.assistantList = []; // lista delle persone registrate

            ctrl.value = true;

            ctrl.getAllAssistant = getAllAssistantFn;
            ctrl.setScrumMaster = setScrumMasterFn;
            ctrl.setProductOwner = setProductOwnerFn;
            ctrl.unsetScrumMaster = unsetScrumMasterFn;
            ctrl.unsetProductOwner = unsetProductOwnerFn;
            ctrl.setTeamMember = setTeamMemberFn;
            ctrl.unsetTeamMember = unsetTeamMemberFn;
            ctrl.buildScrumTeam = buildScrumTeamFn;
            ctrl.resetFields = resetFieldsFn;

            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
            $scope.dtColumnDefsLeft = [
                DTColumnDefBuilder.newColumnDef(4).notSortable()
            ];
            $scope.dtColumnDefsRight = [
                DTColumnDefBuilder.newColumnDef(3).notSortable()
            ];


            resetFieldsFn();

            ctrl.resetFields = resetFieldsFn;
            ctrl.insertScrumTeam = insertScrumTeamFn;

            function resetFieldsFn() {
                console.log('ResetScurmTeamFn')

                ctrl.currentScrumTeam = {};
            }

            function insertScrumTeamFn() {
                console.log('insertScurmTeamFn')
                ScrumTeamDataFactory.Insert(ctrl.currentScrumTeam,
                    function (response) {
                        console.log(response);
                        resetFieldsFn();
                        $state.go('scrumteam.assign', {}, {reload: 'scrumteam.assign'});
                    }, function (response) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'inserimento dello scrum team"})
                    });
            }

            init();

            function init() {
                //setCurrentScrumTeam();
                getAllAssistantFn();
            }

            /*function filterWhatNotAssistant(user) {
                //return user.roles[0].name === 'assistant';
                return user.role === 'SCRUM_TEAM_MEMBER' || user.role === 'SCRUM_MASTER' || user.role === 'PRODUCT_OWNER';
            }*/


            function setCurrentScrumTeam() {
    console.log("errore?")
                ScrumTeamDataFactory.GetCompleteTeam($stateParams.teamId, function (completeTeam) {
                    ctrl.currentScrumTeam = completeTeam;
                    getAllAssistantFn();
                }, function (error) {
                    ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nel recupero dello scrum team"})
                })
            }

            function getAllAssistantFn() {
                UserDataFactory.GetAll(function (assistants) {
                    ctrl.assistantList = assistants;//.filter(filterWhatNotAssistant);
                    mergeAssistantFn();
                }, function (error) {
                    ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nel recupero dei membri"});
                });
            }

            function changeStateFn() {
                if (ctrl.value) {
                    ctrl.value = false;
                } else {
                    ctrl.value = true;
                }
            }

            function setScrumMasterFn(member) {
                changeStateFn();

                ctrl.currentScrumTeam.scrumMaster = member;
                let index = ctrl.assistantList.indexOf(member);
                ctrl.assistantList.splice(index, 1);
            }

            function unsetScrumMasterFn() {
                changeStateFn();
                ctrl.assistantList.push(ctrl.currentScrumTeam.scrumMaster);
                ctrl.currentScrumTeam.scrumMaster = null;
            }

            function setProductOwnerFn(member) {
                changeStateFn();

                ctrl.currentScrumTeam.productOwner = member;
                let index = ctrl.assistantList.indexOf(member);
                ctrl.assistantList.splice(index, 1);
            }

            function unsetProductOwnerFn() {
                changeStateFn();
                ctrl.assistantList.push(ctrl.currentScrumTeam.productOwner);
                ctrl.currentScrumTeam.productOwner = null;
            }

            function setTeamMemberFn(member) {
                ctrl.currentScrumTeam.teamMembers.push(member);

                let index = ctrl.assistantList.indexOf(member);
                ctrl.assistantList.splice(index, 1);

            }

            function unsetTeamMemberFn(member) {

                ctrl.assistantList.push(member);
                let index = ctrl.currentScrumTeam.teamMembers.indexOf(member);
                ctrl.currentScrumTeam.teamMembers.splice(index, 1)
            }

            function buildScrumTeamFn() {

                //da rivedere i parametri passati
                ScrumTeamDataFactory.BuildScrumTeam(ctrl.currentScrumTeam, function () {
                    $state.go('') // home
                });
            }

            function resetFieldsFn() {
                //da fare
            }

            function mergeAssistantFn() {

                ctrl.assistantList.forEach(function (assistant) {
                    if (ctrl.currentScrumTeam.scrumMaster.id === assistant.id) {
                        let index = ctrl.assistantList.indexOf(assistant);
                        ctrl.assistantList.splice(index, 1);
                    }
                    if (ctrl.currentScrumTeam.productOwner.id === assistant.id) {
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
                    })
                });

            }
        }

    ]);