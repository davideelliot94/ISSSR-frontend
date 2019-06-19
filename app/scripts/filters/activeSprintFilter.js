mainAngularModule
    .filter('activeSprintFilter', function () {
        return function (input) {

            if (input == true) {
                return 'Sprint Attivo';
            }
            if (input == false) {
                return 'Sprint chiuso';
            }
            if (input == null) {
                return 'Sprint non attivo';
            }

            return 'Non specificato';

        };
    });