'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

mainAngularModule
    .directive('sidebar', ['AuthFactory', 'storageService', function (AuthFactory, storageService) {
        //console.log(AuthFactory);
        return {
            templateUrl: 'scripts/directives/sidebar/sidebar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope) {
                $scope.selectedMenu = 'dashboard';
                $scope.collapseVar = 0;
                $scope.multiCollapseVar = 0;
                $scope.userInfo = null;

                $scope.counter = 5;

                var containsObjectByName = function(obj, list) {
                    var i;
                    for (i = 0; i < list.length; i++) {
                        if (list[i].nome === obj.nome) {
                            return true;
                        }
                    }

                    return false;
                }

                $scope.setSidebar = function () {
                    //console.log("entro nella setSidebar");
                    $scope.userInfo = AuthFactory.getAuthInfo();
                    console.log($scope.userInfo);
                    let authorities = $scope.userInfo.authorities;
                    let sidebar = JSON.parse(storageService.get('sidebar'));
                    $scope.sidebarList = { lists: []};
                    var subsidebar;
                    if(authorities.length > 0) {
                        $scope.sidebarList.lists= $scope.sidebarList.lists.concat(sidebar[authorities[0].authority]);
                    }
                    for(var i = 1; i < authorities.length; ++i) {
                        subsidebar = sidebar[authorities[i].authority];
                        for (var j in subsidebar) {
                            var In = false;
                            for(var z = 0; z < $scope.sidebarList.lists.length; ++z) {
                                if($scope.sidebarList.lists[z].title === subsidebar[j].title) {
                                    for(var w = 0; w < subsidebar[j].item.length; w++) {
                                        if(containsObjectByName(subsidebar[j].item[w], $scope.sidebarList.lists[z].item) === false) {
                                            $scope.sidebarList.lists[z].item.push(subsidebar[j].item[w]);

                                        }
                                    }
                                    In = true;
                                    break;
                                }
                            }
                            if(!In) {$scope.sidebarList.lists.push(subsidebar[j]);}
                        }
                    }
                    // let _sidebarList = JSON.parse(storageService.get('sidebar'));
                    // $scope.sidebarList.lists = $scope.sidebarList.lists.concat(_sidebarList[$scope.userInfo.userRole]);
                    function compare( a, b ) {
                        if ( a.num < b.num ){
                            return -1;
                        }
                        if ( a.num > b.num ){
                            return 1;
                        }
                        return 0;
                    }

                    $scope.sidebarList.lists.sort( compare );
                    for (let t = 0; t < $scope.sidebarList.lists.length; t++){
                        $scope.sidebarList.lists[t].item.sort();
                    }

                };

                $scope.incrementCounter = function () {
                    $scope.counter++;
                };

                $scope.resetCounter = function () {
                    $scope.counter = 0;
                };

                $scope.$watch(function () {
                    return AuthFactory.getAuthInfo;
                }, function () {
                    $scope.setSidebar();
                });

                $scope.check = function (x) {

                    if (x == $scope.collapseVar)
                        $scope.collapseVar = 0;
                    else
                        $scope.collapseVar = x;
                };

                $scope.multiCheck = function (y) {

                    if (y == $scope.multiCollapseVar)
                        $scope.multiCollapseVar = 0;
                    else
                        $scope.multiCollapseVar = y;
                };


            }
        }
    }]);