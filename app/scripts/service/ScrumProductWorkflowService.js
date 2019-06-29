'use strict'
mainAngularModule
    .service('ScrumProductWorkflowService', ['$http', 'BACKEND_BASE_URL', 'SCRUM_PRODUCT_WORKFLOW_ENDPOINT_URL', '$q',
        function ($http, BACKEND_BASE_URL, SCRUM_PRODUCT_WORKFLOW_ENDPOINT_URL, $q) {

            // La funzione invia una richiesta al backend per inserire uno scrum product workflow
            this.insertScrumProductWorkflowService = function (scrumProductWorkflow) {
                let deferred = $q.defer();
                $http.post(BACKEND_BASE_URL + SCRUM_PRODUCT_WORKFLOW_ENDPOINT_URL,
                    {'name': scrumProductWorkflow.name, 'states': scrumProductWorkflow.states})
                    .then(function successCallback(response) {
                        if (response.status === 201) {
                            deferred.resolve(response);
                        } else {
                            deferred.reject(response);
                        }
                    }, function errorCallback(response) {
                        console.log(response.status);
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            // La funzione invia una richiesta al backend per ottenere tutti gli scrum product workflow
            this.getAllScrumProductWorkflowService = function () {
                let deferred = $q.defer();
                $http.get(BACKEND_BASE_URL + SCRUM_PRODUCT_WORKFLOW_ENDPOINT_URL)
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            deferred.resolve(response);
                        } else {
                            deferred.reject(response);
                        }
                    }, function errorCallback(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            // La funzione invia una richiesta al backend per eliminare uno scrum product workflow
            this.deleteScrumProductWorkflowService = function (scrumProductWorkflow) {
                let deferred = $q.defer();
                $http.delete(BACKEND_BASE_URL + SCRUM_PRODUCT_WORKFLOW_ENDPOINT_URL + scrumProductWorkflow.id)
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            deferred.resolve(response);
                        } else {
                            deferred.reject(response);
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            // La funzione invia una richiesta al backend per aggiornare uno scrum product workflow
            this.modifyScrumProductWorkflowService = function (scrumProductWorkflow) {
                let deferred = $q.defer();
                $http.put(BACKEND_BASE_URL + SCRUM_PRODUCT_WORKFLOW_ENDPOINT_URL,
                    {'id': scrumProductWorkflow.id, 'name': scrumProductWorkflow.name, 'states': scrumProductWorkflow.states})
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            deferred.resolve(response);
                        } else {
                            deferred.reject(response);
                        }
                    }, function errorCallback(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            };





        }
    ]);