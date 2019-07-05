'use strict'
mainAngularModule
    .service('ScrumProductService', ['$http', '$q', 'BACKEND_BASE_URL', 'SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL',
        'SOFTWARE_PRODUCTS_ENDPOINT_URL', 'AuthFactory', 'SCRUMTEAM_ENDPOINT_URL',
        function ($http, $q, BACKEND_BASE_URL, SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL, SOFTWARE_PRODUCTS_ENDPOINT_URL,
                  AuthFactory, SCRUMTEAM_ENDPOINT_URL) {
            // La funzione permette di ottenere tutti i prodotti sul quale uno scrum team di cui fa parte l'utente sta lavorando
            this.getProductByScrumMember = function () {
                let deferred = $q.defer();
                var username = AuthFactory.getAuthInfo().username
                $http.get(BACKEND_BASE_URL + SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL + 'product/user/' + username)
                    .then(function successCallback(response) {
                            if (response.status === 200) {
                                deferred.resolve(response.data);
                            } else {
                                deferred.reject(new Error('Errore Interno'));
                            }
                        }, function errorCallback(response) {
                            if (response.status === 400) {
                                deferred.reject(new Error(' Richiesta non valida'));
                            } else {
                                deferred.reject(new Error('Errore Interno'));
                            }
                        }
                    );
                return deferred.promise;
            };


            // La funzione effettua una chiamata al backend per ottenere tutte le associazioni tra
            // prodotti e team Scrum esistenti

            this.getExistentAssignmentsService = function () {
                let deferred = $q.defer();
                $http.get(BACKEND_BASE_URL + SOFTWARE_PRODUCTS_ENDPOINT_URL + 'scrumAssignments')
                    .then(function successCallback(response) {
                            if (response.status === 200) {
                                deferred.resolve(response.data);
                            } else {
                                deferred.reject(new Error('Errore Interno'));
                            }
                        }, function errorCallback(response) {
                            deferred.reject(new Error('Errore Interno'));
                        }
                    );
                return deferred.promise;
            };

            // La funzione invia una richiesta al backend per assegnare un prodotto
            // (e il relativo workflow) a uno scrum team
            this.assignProductToScrumTeam = function (scrumTeamId, productId, workflowId) {
                let deferred = $q.defer();
                $http.post(BACKEND_BASE_URL + SCRUMTEAM_ENDPOINT_URL +
                    'assignProduct' + '/' + scrumTeamId + '/' + productId + '/' + workflowId)
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

        }]);