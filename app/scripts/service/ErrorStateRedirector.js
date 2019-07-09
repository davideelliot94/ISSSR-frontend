'use strict';

mainAngularModule
    .service('ErrorStateRedirector', ['$state','AuthFactory',function ($state,AuthFactory) {
        this.GoToErrorPage = function (errorMsgObject) {
            //sleep(10);
            if(errorMsgObject["Messaggio"] === "Login session expired"){
                localStorage.removeItem(AuthFactory.getAuthInfo().username);
                AuthFactory.deleteAuthInfo();
                $state.go('login');
            }else{
                $state.go('error.details', {errorObject: errorMsgObject});
            }
        };

    }]);