'use strict';

mainAngularModule
    .service('ErrorStateRedirector', ['$state','AuthFactory',function ($state,AuthFactory) {
        this.GoToErrorPage = function (errorMsgObject) {


            if(errorMsgObject["Messaggio"] === "Login session expired"){
                localStorage.removeItem(AuthFactory.getAuthInfo().username);
                AuthFactory.deleteAuthInfo();
                $state.go('login');
            }else{
                $state.go('error.details', {errorObject: errorMsgObject});
            }
        };

    }]);