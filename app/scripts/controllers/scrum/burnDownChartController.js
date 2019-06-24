'use strict';

mainAngularModule.controller('LineCtrl', ['$scope', '$stateParams', 'BurndownChartDataFactory', 'sprint', 'product',
    '$mdDialog',
    function ($scope, $stateParams, BurndownChartDataFactory, sprint, product, $mdDialog) {

    let sprintId = sprint.id;
    let productName = product.name;
    let sprintNumber = sprint.number;
    var clabels = [];
    var clabels2 = [];

    function getDates() {

        BurndownChartDataFactory.GetDates(sprintId, function (dates) {

            $scope.labels = dates;
            console.log(dates);
            BurndownChartDataFactory.GetStoryPoint(sprintId, $scope.labels, function (storyPoints) {

                clabels.push(storyPoints);
                $scope.data = clabels;
                console.log($scope.data);
            });

        });

    }

    $scope.lineOptions ={ elements : { line : { tension : 0.0} }, scales: {
            yAxes: [{id: 'y-axis-1', ticks: {min: 0}}]
        } };
    $scope.sprintId = sprintId;
    $scope.productName = productName;
    $scope.sprintNumber = sprintNumber;

    $scope.data = clabels2;

    $scope.onClick = function (points, evt) {
        console.log(points, evt);

    };

    $scope.closeDialog = function() {
        $mdDialog.cancel();
    };


    getDates();

}]);