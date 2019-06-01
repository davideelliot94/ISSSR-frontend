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
    .factory('SprintCreateDataFactory', ['$http', 'BACKEND_BASE_URL', 'TICKET_ENDPOINT_URL', 'ToasterNotifierHandler',
        function ($http, BACKEND_BASE_URL, TICKET_ENDPOINT_URL, ToasterNotifierHandler) {
            let thisCrudService = {};
            let _endPointJSON = BACKEND_BASE_URL + TICKET_ENDPOINT_URL;


            function InsertFn(sprint, successCB, errorCB) {
                console.log("Sprint: ", sprint);
                $http({
                    method: 'POST',
                    url: _endPointJSON,
                    data: sprint
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



            function getMetadata(productOwnerId,success, error) {

                $http({
                    method: 'GET',
                    url: _endPointJSON + 'target',
                    data: {id: productOwnerId}
                })
                    .then(function (response) {
                            success(response);
                        },
                        function (response) {
                            if (error) {
                                error(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }





            thisCrudService.Insert = InsertFn;
            thisCrudService.getMetadata = getMetadata;


            return thisCrudService;
        }]);

