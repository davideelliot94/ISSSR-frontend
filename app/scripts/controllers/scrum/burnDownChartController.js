'use strict';

mainAngularModule.controller('LineCtrl', ['$scope', '$stateParams', 'BurndownChartDataFactory', function ($scope, $stateParams, BurndownChartDataFactory) {

    let sprintId = $stateParams.sprintId;
    var ctrl = this;
    var clabels =[];

    function getDates() {

        BurndownChartDataFactory.GetDates(sprintId, function (dates) {

            $scope.labels = dates;

            for (var i = 0; i < dates.length; i++) {
                
                BurndownChartDataFactory.GetStoryPoint(sprintId, dates, function (storyPoints) {

                    $scope.data = storyPoints;

                });            }
        });

    }

    /*function getStoryPint() {

        BurndownChartDataFactory.GetStoryPoint(sprintId, clabels, function (storyPoints) {

            $scope.data = storyPoints;

        });

    }*/

    $scope.sprintId = sprintId;

    $scope.series = ['Series A'];

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    getDates();

}]);