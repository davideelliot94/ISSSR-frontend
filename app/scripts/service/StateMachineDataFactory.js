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
    .factory('StateMachineDataFactory', ['$http', 'ToasterNotifierHandler', 'BACKEND_BASE_URL', 'STATE_MACHINE_ENDPOINT_URL',
        function ($http, ToasterNotifierHandler, BACKEND_BASE_URL, STATE_MACHINE_ENDPOINT_URL) {
            var thisCrudService = {};

            var _endPointJSON = BACKEND_BASE_URL + STATE_MACHINE_ENDPOINT_URL;
/*
            thisCrudService.GetAll = GetAllFn;
            thisCrudService.GetSingle = GetSingleFn;
            thisCrudService.Insert = InsertFn;
            thisCrudService.Update = UpdateFn;
            thisCrudService.Remove = RemoveFn;*/
            thisCrudService.getStateMachines = getStateMachines;

            function getStateMachines(success, error) {

                $http({
                    method: 'GET',
                    url: _endPointJSON
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
                        })
            }


            // get all data from database
            function GetAllFn(successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointJSON
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
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            // get single record from database
            function GetSingleFn(id, successCB, errorCB) {

                $http({
                    method: 'GET',
                    url: _endPointJSON + id
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
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            // post the data from database
            function InsertFn(product, successCB, errorCB) {

                $http({
                    method: 'POST',
                    url: _endPointJSON,
                    data: product
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                                ToasterNotifierHandler.handleCreation(response);
                            }
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            // put the data from database
            function UpdateFn(product, successCB, errorCB) {

                $http({
                    method: 'PUT',
                    url: _endPointJSON + product.id,
                    data: product
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
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            // delete the data from database
            function RemoveFn(productId, successCB, errorCB) {

                $http({
                    method: 'DELETE',
                    url: _endPointJSON + productId
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                            }
                            ToasterNotifierHandler.showSuccessToast("Eliminazione avvenuta con successo", "");
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            console.error(response.data);
                            ToasterNotifierHandler.handleError(response);
                        });
            }


            return thisCrudService;
        }]);

