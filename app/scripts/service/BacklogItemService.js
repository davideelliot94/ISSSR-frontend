'use strict';

mainAngularModule
    .service('BacklogItemService', ['$http', 'ToasterNotifierHandler', '$q', 'BACKEND_BASE_URL',
        'SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL',
        function ( $http, ToasterNotifierHandler, $q, BACKEND_BASE_URL, SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL){

            // La funzione invia una richiesta al backend per inserire un item nel product backlog del prodotto passato
            // come parametro.
            this.insertBacklogItemService = function (productId, backlogItem) {
                let deferred = $q.defer();
                $http.post(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + 'target/' + productId + '/item',
                    {'title': backlogItem.title, 'description' : backlogItem.description, 'priority' : backlogItem.priority,
                        'effortEstimation': backlogItem.effortEstimation})
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


            // La funzione invia una richiesta al back end per l'ottenimento di tutti gli item all'interno del product backlog
            // del prodotto passato come parametro.
            this.getProductBacklogItemService = function (productId) {
                let deferred = $q.defer();
                $http.get(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + 'items/product/' + productId)
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            deferred.resolve(response.data);
                        } else {
                            deferred.reject(response);
                        }
                    }, function errorCallback(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            // La funzione invia una richiesta al back end per l'ottenimento di tutti gli item all'interno dello sprint backlog
            // del prodotto passato come parametro.
            this.getSprintBacklogItemService = function (productId) {
                let deferred = $q.defer();
                $http.get(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + 'items/product/' + productId + '/sprint')
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            deferred.resolve(response.data);
                        } else {
                            deferred.reject(response);
                        }
                    }, function errorCallback(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            // La funzione invia una richiesta al backend per inserire un item nello sprint backlog del prodotto passato
            // come parametro.
            this.insertBacklogItemToSprintBacklogService = function (productId, backlogItem) {
                let deferred = $q.defer();
                $http.put(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + 'target/' + productId + '/item/sprint',
                    {'id': backlogItem.id, 'title': backlogItem.title, 'description' : backlogItem.description,
                        'priority' : backlogItem.priority, 'effortEstimation': backlogItem.effortEstimation})
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

            this.changeStatusToSprintBacklogItemService = function (itemId, direction) {
                let deferred = $q.defer();
                $http.put(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + 'items/sprint/' + direction + '/' + itemId)
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

