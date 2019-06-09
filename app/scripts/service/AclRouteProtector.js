'use strict';

mainAngularModule
    .service('AclRouteProtector', ['$q', 'AclService','storageService', function ($q, AclService,storageService) {

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

    }]);