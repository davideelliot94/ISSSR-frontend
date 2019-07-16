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
                };
                //set the sidebar by concat jobs of subsidebar parts related to authorities
                //final sidebar will be builded and ordered from the actual authorities related from actual user
                $scope.setSidebar = function () {
                    //console.log("entro nella setSidebar");
                    $scope.userInfo = AuthFactory.getAuthInfo();
                    console.log($scope.userInfo);
                    let authorities = $scope.userInfo.authorities;
                    let sidebar = JSON.parse(storageService.get('sidebar'));    //sidebar parts map authority->sidebarElements received from backend
                    $scope.sidebarList = { lists: []};
                    var subsidebar;
                    ////    Dinamic sidebar generation  ///////
                    if(authorities.length > 0) {
                        console.log('sidebar is: ' + sidebar);
                        console.log('autorities[o].authority is: ' + sidebar[authorities[0].authority]);
                        $scope.sidebarList.lists= $scope.sidebarList.lists.concat(sidebar[authorities[0].authority]);
                    }
                    for(var i = 1; i < authorities.length; ++i) {
                        subsidebar = sidebar[authorities[i].authority];         //sidebar part of current authority related to current user
                        for (var j in subsidebar) {
                            var In = false;
                            //find  item blocks replicated in actual builded sidebar and new part to add
                            for(var z = 0; z < $scope.sidebarList.lists.length; ++z) {
                                if($scope.sidebarList.lists[z].title === subsidebar[j].title) { //on block of items collision in sidebars
                                    for(var w = 0; w < subsidebar[j].item.length; w++) {
                                        if(containsObjectByName(subsidebar[j].item[w], $scope.sidebarList.lists[z].item) === false) { //sub item duplicates filtered insert
                                            $scope.sidebarList.lists[z].item.push(subsidebar[j].item[w]);   //insert only sub items not already present in the building sidebar block
                                        }
                                    }
                                    In = true;                                                  //set flag on collision
                                    break;
                                }
                            }
                            //don't insert item blocks on collision of sidebarParts (NB sub items insert evaluated above
                            if(!In) {$scope.sidebarList.lists.push(subsidebar[j]);}
                        }
                    }
                    // let _sidebarList = JSON.parse(storageService.get('sidebar'));
                    // $scope.sidebarList.lists = $scope.sidebarList.lists.concat(_sidebarList[$scope.userInfo.userRole]);
                    function compare( a, b ) {  //for sorting elements block in builded sidebar by num field
                        if ( a.num < b.num ){
                            return -1;
                        }
                        if ( a.num > b.num ){
                            return 1;
                        }
                        return 0;
                    }

                    $scope.sidebarList.lists.sort( compare );           //builded sidebar sorting bu item num field
                    for(var t = 0; t < $scope.sidebarList.lists.length; ++t) {
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