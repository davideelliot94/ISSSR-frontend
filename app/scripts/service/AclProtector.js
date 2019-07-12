'use strict';

mainAngularModule
    .service('AclProtector', ['$q', 'AclService','storageService', function ($q, AclService,storageService) {

        /* TODO OLD TRIVIAL PERMISSION CHECK
        this.checkRoutePermission = function (permission) {
            console.log("checkRoutePermission");

            if (AclService.can(permission)) {
                return true;
            } else {
                return $q.reject('Unathorized');
            }
        };*/


        /**
         *  check route permission needed to go to a state
         *  check done by searching permission needed to go to state name from  centralized permission json config file in the backend
         *  and controlling if current user has needed permissions
         * @params stateName, simbolic name related to the state to go to
         * @return authorization granted or error trigger
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

        /**
         *  check if the current user has permission to visualize and evaluate DOM element related to simbolicPermission.
            check done by matching permission needed to renderize element related to simbolicPermission
            By default sensitive DOM elements are protected with ng-if with this function.
         * @params simbolicPermission, simbolic name related to a sensitive view element to witch is the showing is restricted
         * @return bool authorization result ( will be used in a ng-if )
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