'use strict';

mainAngularModule.run(['$rootScope', 'DEBUG', 'authManager', 'DTDefaultOptions', 'AclService', 'ErrorStateRedirector', '$transitions', 'AuthFactory', 'storageService','AclProtector',
    function ($rootScope, DEBUG, authManager, DTDefaultOptions, AclService, ErrorStateRedirector, $transitions, AuthFactory, storageService,AclProtector) {

        var aclData = {};
        var oldState = null;

        AuthFactory.getPermission(function(response){
            aclData = JSON.parse(JSON.stringify(response.data));
            console.log(aclData);
            AclService.setAbilities(aclData.roles);
            storageService.save('routes', JSON.stringify(aclData.routes));
            storageService.save('simbolicPermissions', JSON.stringify(aclData.simbolicPermissions));
            storageService.save('sidebar', JSON.stringify(aclData.sidebar));
            //var obj = JSON.parse(prova);
            //console.log(obj);
        }, function (response) {
            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore server"});
        });



        //AclService.setAbilities(aclData);
        // $rootScope.hasPermission = AclService.can;
        $rootScope.hasPermission = AclProtector.hasPermissionSimbolic; //to check symbolic permissions inside DOM by json retrieved
        $rootScope.hasPermissionDirect = AclProtector.can; //to direct permission evaluation

        $rootScope.isDebug = DEBUG;
        console.info('isDebug: ' + $rootScope.isDebug);

        $transitions.onError({}, ($transition$) => {
            console.log("transition onError");

            var toStateName = $transition$.to().name;
            var fromStateName = $transition$.from().name;
            console.log("tostate:" + toStateName + " fromstate: " + fromStateName + "  oldstqte:" + oldState);
            var currentTime = new Date().getTime();

            while (currentTime + 1000 >= new Date().getTime()) {
            }
            if (toStateName != fromStateName && oldState  != fromStateName) {

                let Msg = "Rotta non autorizzata";
                if (DEBUG) {
                    Msg += ": " + toStateName;
                }
                oldState = fromStateName;
                ErrorStateRedirector.GoToErrorPage({Messaggio: Msg});
            }
        });

        authManager.checkAuthOnRefresh();
        authManager.redirectWhenUnauthenticated();

        DTDefaultOptions.setLanguageSource('//cdn.datatables.net/plug-ins/1.10.9/i18n/Italian.json');

    }]);