// TODO rendere configurabili gli indirizzi
mainAngularModule
    .service('BacklogItemService', ['$http', 'ToasterNotifierHandler', '$q',
        function ( $http, ToasterNotifierHandler, $q){
            //TODO parametrizzare
            this.insertBacklogItem = function () {
                let deferred = $q.defer();
                $http.post('http://localhost:8200/ticketingsystem/backlog/target/2/item', {'title': 'Item di Prova', 'description' : 'descrizione di prova', 'priority' : 'LOW', 'effortEstimation': 1, 'status':'INIT'})
                    .then(function successCallback(response) {
                        if (response.status === 201) {
                            console.log(response.data);
                            deferred.resolve();
                        }
                }, function errorCallback(response) {
                            deferred.reject();
                });
                return deferred.promise;
            };
        }]);
