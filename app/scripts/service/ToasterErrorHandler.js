'use strict';

mainAngularModule
    .service('ToasterNotifierHandler', ['toaster', function (toaster) {
        this.handleError = function (response) {
            if (response.status === 403) {
                toaster.pop({
                    type: 'error',
                    title: 'Permesso negato',
                    body: response.data.message,
                });
            } else if (response.status === 404) {
                toaster.pop({
                    type: 'error',
                    title: 'Oggetto non trovato',
                    body: response.data.message,
                });
            } else if (response.status === 409) {
                toaster.pop({
                    type: 'error',
                    title: 'Operazione non permessa',
                    body: response.data.message,
                });
            } else if (response.status === 400) {
                toaster.pop({
                    type: 'error',
                    title: 'Richiesta non valida',
                    body: response.data.message,
                });
            } else if (response.status === 500) {
                toaster.pop({
                    type: 'error',
                    title: 'Errore inatteso',
                    body: response.data.message,
                });
            } else {
                //DEBUG
                console.error(response.data);
            }
        };

        this.showErrorToast = function (message) {
            toaster.pop({
                type: 'error',
                title: 'Errore:',
                body: message,
            });
        };

        this.showSuccessToast = function (title, message) {
            toaster.pop({
                type: 'success',
                title: title,
                body: message,
            });
        };

        this.handleCreation = function (response) {
            if (response.status === 201) {
                toaster.pop({
                    type: 'success',
                    title: 'Creazione avvenuta con successo',
                    body: response.data.message,
                });
            }

        };
    }]);