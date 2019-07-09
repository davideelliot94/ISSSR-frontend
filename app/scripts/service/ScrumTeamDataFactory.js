'use strict';
/* Oggetto Factory che incapsula l'interazione con lo strato di Back-End, necessaria per la Gestione degli Scrum Team*/
mainAngularModule
    .factory('ScrumTeamDataFactory', ['$http', 'ToasterNotifierHandler', 'BACKEND_BASE_URL', 'SCRUMTEAM_ENDPOINT_URL', '$q',
        function ($http, ToasterNotifierHandler, BACKEND_BASE_URL, SCRUMTEAM_ENDPOINT_URL, $q) {
            let thisCrudService = {};

            let _endPointJSON = BACKEND_BASE_URL + SCRUMTEAM_ENDPOINT_URL;


            // Invia allo strato di back-end una richiesta HTTP Post per la creazione di uno Scrum Team
            function InsertFn(team, successCB, errorCB) {
                let teamMemberIds = [];
                let i;
                for (i = 0; i < team.teamMembers.length; i++) {
                    teamMemberIds.push(team.teamMembers[i].id);
                }
                $http({
                    method: 'POST',
                    url: _endPointJSON,
                    headers: { 'Content-Type': 'application/json', 'Accept' : 'application/json' },
                    data: {'name': team.name, 'productOwner': team.productOwner.id, 'scrumMaster': team.scrumMaster.id, 'teamMembers': teamMemberIds}
                })
                    .then(function (response) {
                            if (successCB) {
                                successCB(response.data);
                                // in caso di successo, viene visualizzato un toast che informa l'utente della creazione avvenuta con successo
                                ToasterNotifierHandler.handleCreation(response);
                            }
                            //return response.data;
                        },
                        function (response) {
                            if (errorCB) {
                                errorCB(response);
                            }
                            // in caso di errore, viene visualizzato un toast che informa l'utente della mancata creazione
                            ToasterNotifierHandler.handleError(response);
                        });
            }

            // Invia allo strato di back-end una richiesta HTTP DELETE per la cancellazione dello scrumTeam avente l'id specificato
            function RemoveScrumTeam(scrumTeamId, successCB, errorCB) {

                $http({
                    method: 'DELETE',
                    url: _endPointJSON + scrumTeamId
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
                            // In caso di errore, un apposito toast di notifica viene visualizzato
                            ToasterNotifierHandler.handleError(response);
                        });
            }



            function FindScrumTeamBySprintFn(sprintId) {
                let deferred = $q.defer();
                $http.get(BACKEND_BASE_URL + SCRUMTEAM_ENDPOINT_URL + 'sprint/' + sprintId)
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
            }

            thisCrudService.Insert = InsertFn;
            thisCrudService.FindScrumTeamBySprint = FindScrumTeamBySprintFn;
            thisCrudService.RemoveScrumTeam = RemoveScrumTeam;

            return thisCrudService;
        }]);

