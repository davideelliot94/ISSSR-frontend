'use strict'
mainAngularModule
    .service('ScrumProductService', ['$http', '$q', 'BACKEND_BASE_URL', 'SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL', 'AuthFactory',
        // La funzione permette di ottenere tutti i prodotti sul quale uno scrum team di cui fa parte l'utente sta lavorando
        function ( $http, $q, BACKEND_BASE_URL, SCRUM_BACKLOG_MANAGEMENT_ENDPOINT_URL, AuthFactory){
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
                        } else
                            deferred.reject(new Error('Errore Interno'));
                        }
                    );
                return deferred.promise;
            };
        }

    ]);