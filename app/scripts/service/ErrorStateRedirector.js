'use strict';

mainAngularModule
    .service('ErrorStateRedirector', ['$state', function ($state) {
        this.GoToErrorPage = function (errorMsgObject) {
            console.log("going to error page");
            //sleep(10);
            setTimeout(10);
            if(errorMsgObject["Messaggio"] === "Login session expired"){
                console.log("it's expired!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                ToasterNotifierHandler.handleError("Expired session; please, do login");
                toaster.pop("Expired session; please, do login");
                $state.go('login');
            }else{
                console.log("msg is: "+ JSON.stringify(errorMsgObject));
                console.log("value: " + JSON.stringify(Object.keys(errorMsgObject)));
                console.log("value(2): " + JSON.stringify(errorMsgObject["Messaggio"]));
               // $state.go('login');
            }
            //$state.go('login');
            //$state.go('error.details', {errorObject: errorMsgObject});
        };

    }])