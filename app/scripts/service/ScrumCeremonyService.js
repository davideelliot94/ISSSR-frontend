'use strict';
mainAngularModule
    .service('ScrumCeremonyService', ['$http', '$q', 'BACKEND_BASE_URL', 'SCRUM_CEREMONY_ENDPOINT_URL',
        function ( $http, $q, BACKEND_BASE_URL, SCRUM_CEREMONY_ENDPOINT_URL){
        // La funzione restituisce le scrum ceremonies associate ad uno sprint
        this.getSprintScrumCeremonies = function (sprintId) {
                let deferred = $q.defer();
                $http.get(BACKEND_BASE_URL + SCRUM_CEREMONY_ENDPOINT_URL + 'sprint/' + sprintId)
                    .then(function successCallback(response) {
                            if (response.status === 200) {
                                deferred.resolve(response.data);
                            } else {
                                deferred.reject(new Error('Errore Interno'));
                            }
                        }, function errorCallback(response) {
                            if (response.status === 400) {
                                deferred.reject(new Error(' Richiesta non valida'));
                            } else{
                                deferred.reject(new Error('Errore Interno'));
                            }}
                    );
                return deferred.promise;
            };

        this.createScrumCeremony = function (scrumCeremony) {
            let deferred = $q.defer();
            $http.post(BACKEND_BASE_URL + SCRUM_CEREMONY_ENDPOINT_URL,
                scrumCeremony)
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
    }
]);