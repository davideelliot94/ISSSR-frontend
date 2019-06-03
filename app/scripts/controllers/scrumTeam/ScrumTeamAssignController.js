'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('ScrumTeamAssignCtrl', ['$scope', '$state', '$location', '$anchorScroll', '$stateParams', 'ScrumTeamDataFactory', 'UserDataFactory', 'ErrorStateRedirector', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        function ($scope, $state, $location, $anchorScroll, $stateParams, ScrumTeamDataFactory, UserDataFactory, ErrorStateRedirector, DTOptionsBuilder, DTColumnDefBuilder) {

            var ctrl = this;
            ctrl.currentTeam = {
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
            ctrl.buildTeam = buildTeamFn;
            ctrl.resetFields = resetFieldsFn;

            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
            $scope.dtColumnDefsLeft = [
                DTColumnDefBuilder.newColumnDef(4).notSortable()
            ];
            $scope.dtColumnDefsRight = [
                DTColumnDefBuilder.newColumnDef(3).notSortable()
            ];


            init();

            function init() {
                setCurrentTeam();
            }

            function filterWhatNotAssistant(user) {
                //return user.roles[0].name === 'assistant';
                return user.role === 'SCRUM_TEAM_MEMBER' || user.role === 'SCRUM_MASTER' || user.role === 'PRODUCT_OWNER';
            }


            function setCurrentTeam() {

                ScrumTeamDataFactory.GetCompleteTeam($stateParams.teamId, function (completeTeam) {
                    ctrl.currentTeam = completeTeam;
                    getAllAssistantFn();
                }, function (error) {
                    ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nel recupero del team"})
                })
            }

            function getAllAssistantFn() {
                UserDataFactory.GetAll(function (assistants) {
                    ctrl.assistantList = assistants.filter(filterWhatNotAssistant);
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

                ctrl.currentTeam.scrumMaster = member;
                let index = ctrl.assistantList.indexOf(member);
                ctrl.assistantList.splice(index, 1);
            }

            function unsetScrumMasterFn() {
                changeStateFn();
                ctrl.assistantList.push(ctrl.currentTeam.scrumMaster);
                ctrl.currentTeam.scrumMaster = null;
            }

            function setProductOwnerFn(member) {
                changeStateFn();

                ctrl.currentTeam.productOwner = member;
                let index = ctrl.assistantList.indexOf(member);
                ctrl.assistantList.splice(index, 1);
            }

            function unsetProductOwnerFn() {
                changeStateFn();
                ctrl.assistantList.push(ctrl.currentTeam.productOwner);
                ctrl.currentTeam.productOwner = null;
            }

            function setTeamMemberFn(member) {
                ctrl.currentTeam.teamMembers.push(member);

                let index = ctrl.assistantList.indexOf(member);
                ctrl.assistantList.splice(index, 1);

            }

            function unsetTeamMemberFn(member) {

                ctrl.assistantList.push(member);
                let index = ctrl.currentTeam.teamMembers.indexOf(member);
                ctrl.currentTeam.teamMembers.splice(index, 1)
            }

            function buildTeamFn() {

                //da rivedere i parametri passati
                ScrumTeamDataFactory.BuildTeam(ctrl.currentTeam, function () {
                    $state.go('') // home
                });
            }

            function resetFieldsFn() {
                //da fare
            }

            function mergeAssistantFn() {

                ctrl.assistantList.forEach(function (assistant) {
                    if (ctrl.currentTeam.scrumMaster.id === assistant.id) {
                        let index = ctrl.assistantList.indexOf(assistant);
                        ctrl.assistantList.splice(index, 1);
                    }
                    if (ctrl.currentTeam.productOwner.id === assistant.id) {
                        let index = ctrl.assistantList.indexOf(assistant);
                        ctrl.assistantList.splice(index, 1);
                    }
                });

                ctrl.currentTeam.teamMembers.forEach(function (member) {
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

