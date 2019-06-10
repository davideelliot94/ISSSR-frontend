'use strict';

mainAngularModule.run(['$rootScope', 'DEBUG', 'authManager', 'DTDefaultOptions', 'AclService', 'ErrorStateRedirector', '$transitions', 'AuthFactory', 'storageService',
    function ($rootScope, DEBUG, authManager, DTDefaultOptions, AclService, ErrorStateRedirector, $transitions, AuthFactory, storageService) {

        var aclData = {};

        AuthFactory.getPermission(function(response){
            aclData = JSON.parse(JSON.stringify(response.data));
            console.log(aclData);
            AclService.setAbilities(aclData.roles);
            storageService.save('routes', JSON.stringify(aclData.routes));
            //var obj = JSON.parse(prova);
            //console.log(obj);
        }, function (response) {
            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore server"});
        });



        //AclService.setAbilities(aclData);
        $rootScope.hasPermission = AclService.can;

        $rootScope.isDebug = DEBUG;
        console.info('isDebug: ' + $rootScope.isDebug);

        $transitions.onError({}, ($transition$) => {
            var toStateName = $transition$.to().name;
            var fromStateName = $transition$.from().name;
            if (toStateName != fromStateName) {

                let Msg = "Rotta non autorizzata";
                if (DEBUG) {
                    Msg += ": " + toStateName;
                }
                ErrorStateRedirector.GoToErrorPage({Messaggio: Msg});
            }
        });

        authManager.checkAuthOnRefresh();
        authManager.redirectWhenUnauthenticated();

        DTDefaultOptions.setLanguageSource('//cdn.datatables.net/plug-ins/1.10.9/i18n/Italian.json');

    }]);