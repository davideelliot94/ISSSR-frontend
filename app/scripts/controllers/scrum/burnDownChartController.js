'use strict';

mainAngularModule.controller('LineCtrl', ['$scope', '$stateParams', 'BurndownChartDataFactory', function ($scope, $stateParams, BurndownChartDataFactory) {

    let sprintId = $stateParams.sprintId;
    var clabels = [];
    var clabels2 = [];

    function getDates() {

        BurndownChartDataFactory.GetDates(sprintId, function (dates) {

            $scope.labels = dates;
            BurndownChartDataFactory.GetStoryPoint(sprintId, $scope.labels, function (storyPoints) {

                clabels.push(storyPoints);
                $scope.data = clabels;

            });

        });

    }

    /*function getStoryPint() {

        BurndownChartDataFactory.GetStoryPoint(sprintId, clabels, function (storyPoints) {

            $scope.data = storyPoints;

        });

    }*/

    $scope.lineOptions ={ elements : { line : { tension : 0.0} } };
    $scope.sprintId = sprintId;

    $scope.data = clabels2;
    $scope.onClick = function (points, evt) {
        console.log(points, evt);

    };


    getDates();

}]);