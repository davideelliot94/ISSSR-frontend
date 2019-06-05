'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */

mainAngularModule
    .factory('ScrumTeamDataFactory', ['$http', 'ToasterNotifierHandler', 'BACKEND_BASE_URL', 'SCRUMTEAM_ENDPOINT_URL', '$q',
        function ($http, ToasterNotifierHandler, BACKEND_BASE_URL, SCRUMTEAM_ENDPOINT_URL, $q) {
            var thisCrudService = {};

            var _endPointJSON = BACKEND_BASE_URL + SCRUMTEAM_ENDPOINT_URL;

            //thisCrudService.GetAll = GetAllFn;
            //thisCrudService.GetSingle = GetSingleFn;
            thisCrudService.Insert = InsertFn;
            //thisCrudService.Update = UpdateFn;
            //thisCrudService.Remove = RemoveFn;

            //thisCrudService.BuildScrumTeam = BuildScrumTeamFn;
            //thisCrudService.GetAssistantsByTeamID = GetAssistantsByTeamIDFn;
            //thisCrudService.GetCompleteTeam = GetCompleteTeamFn;

            // POST request to backend for srum team creation
            function InsertFn(team, successCB, errorCB) {
                console.log("inserting");
                console.log(team);
                console.log(_endPointJSON);
                let teamMemberIds = [];
                var i;
                for (i = 0; i < team.teamMembers.length; i++) {
                    teamMemberIds.push(team.teamMembers[i].id);
                }

                console.log(teamMemberIds);
                $http({
                    method: 'POST',
                    url: _endPointJSON,
                    headers: { "Content-Type": "application/json", "Accept" : "application/json" },
                    data: {"name": team.name, "productOwner": team.productOwner.id, "scrumMaster": team.scrumMaster.id, "teamMembers": teamMemberIds}
                })
                    .then(function (response) {
                            if (successCB) {
                                console.log(response.data)
                                successCB(response.data);
                                ToasterNotifierHandler.handleCreation(response);
                            }
                            //return response.data;
                        },
                        function (response) {
                            console.log("returning error")
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }



            return thisCrudService;
        }]);

