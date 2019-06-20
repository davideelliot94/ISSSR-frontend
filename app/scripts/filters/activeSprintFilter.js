mainAngularModule
    .filter('activeSprintFilter', function () {
        return function (input) {

            if (input == true) {
                return 'Attivo';
            }
            if (input == false) {
                return 'Chiuso';
            }
            if (input == null) {
                return 'Non attivo';
            }

            return 'Non specificato';

        };
    });