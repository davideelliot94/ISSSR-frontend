'use strict'
mainAngularModule
    .service('SprintService', ['$http', 'ToasterNotifierHandler', '$q', 'BACKEND_BASE_URL',
        'SPRINT_ENDPOINT_URL',
        function ( $http, ToasterNotifierHandler, $q, BACKEND_BASE_URL, SPRINT_ENDPOINT_URL){

            // La funzione invia una richiesta al backend per l'ottenimento di tutti gli sprint di un dato prodotto
            this.getAllSprintOfProductService = function (productId) {
                let deferred = $q.defer();
                $http.get(BACKEND_BASE_URL + SPRINT_ENDPOINT_URL + productId)
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