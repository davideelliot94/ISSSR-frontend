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
            this.getSprintBacklogItemService = function (productId, sprintNumber) {
                let deferred = $q.defer();
                $http.get(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL +
                    'items/product/' + productId + '/sprint/' + sprintNumber)
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
                $http.put(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + 'target/' + productId +
                    '/item/sprint/' + backlogItem.sprint.number,
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

            // La funzione permette di cambiare lo stato di un item nello sprint backlog
            this.changeItemStateToService = function (itemId, newState) {
                let deferred = $q.defer();
                $http.put(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + 'items/sprint/' + itemId + '/' + newState)
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

            // La funzione invia una richiesta al backedn per eliminare un item dal ProductBacklog
            this.deleteBacklogItemService = function(itemId){
                let deferred = $q.defer();
                $http.delete(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + itemId)
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

            // La funzione invia una richiesta al backend per modificare un item del Product Backlog
            this.editBacklogItemService = function(backlogItem){
                let deferred = $q.defer();
                $http.put(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + 'edit',
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

        }
]);

