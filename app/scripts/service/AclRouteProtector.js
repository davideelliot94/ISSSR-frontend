'use strict';

mainAngularModule
    .service('AclRouteProtector', ['$q', 'AclService', function ($q, AclService) {

        this.checkRoutePermission = function (permission) {
            if (AclService.can(permission)) {
                return true;
            } else {
                console.log("returning unauthoriized");
                return $q.reject('Unathorized');
            }
        };

    }]);