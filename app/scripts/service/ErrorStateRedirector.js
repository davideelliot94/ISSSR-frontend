'use strict';

mainAngularModule
    .service('ErrorStateRedirector', ['$state', function ($state) {
        this.GoToErrorPage = function (errorMsgObject,ToasterNotifierHandler) {
            console.log("going to error page");
            //sleep(10);
            console.log('error state redirector');
            if(errorMsgObject["Messaggio"] === "Login session expired"){
                console.log('msg is login expired');
                ToasterNotifierHandler.showErrorToast("Expired session; please, do login");
                $state.go('login');
            }else{
                console.log("msg is: "+ JSON.stringify(errorMsgObject));
                console.log("value: " + JSON.stringify(Object.keys(errorMsgObject)));
                console.log("value(2): " + JSON.stringify(errorMsgObject["Messaggio"]));
                $state.go('error.details', {errorObject: errorMsgObject});
                // $state.go('login');
            }
        };

    }]);