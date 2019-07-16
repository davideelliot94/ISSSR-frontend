'use strict';

mainAngularModule
    .service('AclProtector', ['$q', 'AclService','storageService', function ($q, AclService,storageService) {

        /* TODO OLD PERMISSION CHECK
        this.checkRoutePermission = function (permission) {
            console.log("checkRoutePermission");

            if (AclService.can(permission)) {
                return true;
            } else {
                return $q.reject('Unathorized');
            }
        };*/
        /*
        check route permission needed to go to stateName
        check done by searching permission needed to go to state name from  centralized permission json config file in the backend
         and controlling if current user has needed permissions*/
        /*
        TODO ricorda x relazione,
        restrizione vista trovate:
        -sidebareJS su ruolo inteso come tipo utente
        -route check == restrizioni rotta da roles associati all'utente corrente
        -html event disables (button disable) = restrizioni ulteriori specifiche su vista
         */
         // Controlla il file permission.json per verificare che l'utente loggato abbia l'autorizzazione per accedere allo
         // stato avente il nome specificato come parametro
        // Viene invocata nel blocco resolve in ogni dichiarazione di stato, che è il blocco dove si specifica di cosa
        // lo state ha bisogno in input
         this.checkRoutePermission = function (stateName) {
             var permissionList=JSON.parse(storageService.get('routes')) ;
             var permission=permissionList[stateName];
             console.log('centralized Check permission'+stateName+'<-needed perm->'+permission);
             if (AclService.can(permission)) {
                        return true;
                    } else {
                        return $q.reject('Unathorized to go to '+stateName);
                    }
                };

         /*
           check if the current user has permission to visualize and evaluate DOM element related to simbolicPermission.
           By default sensitive DOM elements are protected with ng-if with this function.
          */
        this.hasPermissionSimbolic = function (simbolicPermission) {
            var permissionList=JSON.parse(storageService.get('simbolicPermissions')) ;
            var permissionNeeded=permissionList[simbolicPermission];
            var permissionResult =  AclService.can(permissionNeeded);
            console.log('centralized Check simbolic permission'+simbolicPermission+'<-needed perm->'+permissionNeeded + ' resultOf permission: ' + permissionResult );
            return permissionResult;
        };
        },
        ]);