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
   .factory('BurndownChartDataFactory', ['$http', 'BACKEND_BASE_URL', 'SPRINT_ENDPOINT_URL', 'ToasterNotifierHandler',
        function ($http, BACKEND_BASE_URL, SPRINT_ENDPOINT_URL, ToasterNotifierHandler) {
            let thisCrudService = {};
            let _endPointJSON = BACKEND_BASE_URL + SPRINT_ENDPOINT_URL;


            function GetDatesFn(sprintId, successCB, errorCB) {
                console.log('getDates');
                $http({
                    method: 'GET',
                    url: _endPointJSON + 'getDates/' + sprintId,
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                                ToasterNotifierHandler.handleCreation(response);
                            }
                            //return response.data;
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            function GetStoryPointsFN(sprintId, date, successCB, errorCB) {
                console.log('getStoryPoint');
                $http({
                    method: 'GET',
                    url: BACKEND_BASE_URL + '/backlog/getStoryPoint/' + sprintId,
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                                ToasterNotifierHandler.handleCreation(response);
                            }
                            //return response.data;
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            thisCrudService.GetDates = GetDatesFn;
            thisCrudService.GetStoryPoint = GetStoryPointsFN;

            return thisCrudService;
        }]);

