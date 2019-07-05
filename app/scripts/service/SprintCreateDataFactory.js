'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 *
 SPRINT MANAGEMENT

 * Main module of the application.
 */

mainAngularModule
   .factory('SprintCreateDataFactory', ['$http', 'BACKEND_BASE_URL', 'SPRINT_ENDPOINT_URL', 'ToasterNotifierHandler', '$q',
        function ($http, BACKEND_BASE_URL, SPRINT_ENDPOINT_URL, ToasterNotifierHandler, $q) {
            let thisCrudService = {};
            let _endPointJSON = BACKEND_BASE_URL + SPRINT_ENDPOINT_URL;


            function InsertFn(sprint, successCB, errorCB) {
                console.log('Sprint: ', sprint);
                $http({
                    method: 'POST',
                    url: _endPointJSON+'create',
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
                    url: _endPointJSON  +'create/'+productOwnerId

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


            // get all sprints associated to product
            function GetAllFnByProduct(productId, successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointJSON +'product/'+ productId+  '/visualize',

                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
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

            // get all data from database
            function GetAllFnProductOwner(productOwnerId, successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointJSON +'productOwner/'+ productOwnerId+  '/visualize',

                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
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

            function closeSprintFn(id, successCB, errorCB) {

                $http({
                    method: 'POST',
                    url: _endPointJSON + 'close/' + id,

                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
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

            function activateSprintFn(id, successCB, errorCB) {

                $http({
                    method: 'PUT',
                    url: _endPointJSON + 'activate/' + id,

                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                            }
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                        });

            }

            thisCrudService.Insert = InsertFn;
            thisCrudService.getMetadata = getMetadata;
            thisCrudService.closeSprint = closeSprintFn;
            thisCrudService.activateSprint = activateSprintFn;
            thisCrudService.GetAllByProductOwner = GetAllFnProductOwner;
            thisCrudService.GetAllByProduct = GetAllFnByProduct;

            return thisCrudService;
        }]);

