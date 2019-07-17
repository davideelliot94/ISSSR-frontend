'use strict';

mainAngularModule.controller('backlogManagementController', ['$scope', '$state', '$mdDialog', 'ScrumProductService',
    'ToasterNotifierHandler', 'BacklogItemService', 'SprintCreateDataFactory','DTOptionsBuilder', 'DTColumnDefBuilder', '$filter',
    function ($scope, $state, $mdDialog, ScrumProductService, ToasterNotifierHandler, BacklogItemService,SprintCreateDataFactory,
              DTOptionsBuilder, DTColumnDefBuilder, $filter){

    $scope.selectedProduct = {};
    // backlogItem selected
    $scope.backlogItem = {};
    // list of item in product backlog for selected product
    $scope.backlogItems = [];
    //All sprints of selected product in form of a map, mapped sprintNUM->sprint
    $scope.sprints = [];

    $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
    $scope.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(4).notSortable()];
    $scope.isSelectedProduct = false;




    // Si inizializza la combobox con tutti i prodotti su cui lavora uno Scrum Team di cui fa parte l'utente loggato
    let initializeProductList = function () {
        ScrumProductService.getProductByScrumMember()
            .then(function successCallback(products) {
                $scope.productsOfScrumMember = products;
            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
    };
    // Funzione che popola il backlog con gli item ricevuti dal backend
    $scope.populateBacklog = function() {
        $scope.isSelectedProduct = true;
        $scope.states = $scope.selectedProduct.scrumProductWorkflow.states;
        $scope.getSprintsItemsRelatedToProduct();
        // Popolamento del product backlog
        BacklogItemService.getProductBacklogItemService($scope.selectedProduct.id)
            .then(function successCallback(items) {
                $scope.backlogItems = items;
            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
    };
    // populate sprint backlog of the given the sprint with items from backend
    let populateSprintBacklog = function(sprint) {
            BacklogItemService.getSprintBacklogItemService($scope.selectedProduct.id, sprint.number)
                .then(function successCallback(items) {
                    // Alla lista degli item viene aggiunto un item fittizio che servirà da placeholder nell'interfaccia grafica
                    items.push({
                        'id': '',
                        title: 'placeholder',
                        description: 'placeholder',
                        status: '',
                        effortEstimation: 0,
                        priority: -1
                    });

                    sprint.items = items;
                    //add extra link in item to sprint for cheaper refresh on drop
                    for (let i=0; i<sprint.items.length; i++) {
                        sprint.items[i].sprintNumber=sprint.number;
                    }
                    // sprint.isActiveSprint = true;
                }, function errorCallback(response) {
                    if (response.status === 404) {
                        sprint.isActiveSprint = false;
                    } else {
                        ToasterNotifierHandler.handleError(response);
                    }
                });
        };

    //get all sprints and related sprint backlog items of selected product from backend
    $scope.getSprintsItemsRelatedToProduct= function () {
        $scope.sprints=[];
            SprintCreateDataFactory.GetAllByProduct($scope.selectedProduct.id, function (sprints) {
                for (let i=0; i<sprints.length; i++) {      //get sprint backlog items
                    if (sprints[i].isActive !== false) {
                        $scope.sprints[sprints[i].number] = sprints[i]; //set sprint map by sprintNumber
                        populateSprintBacklog($scope.sprints[sprints[i].number]);
                    }
                }
                console.log('final sprints',$scope.sprints);
            }, function () {
                ToasterNotifierHandler.showErrorToast('Errore nel recupero degli Sprint');
            });
        };
    //// DIALOGS    //
    // Apertura di una finestra di dialogo per l'inserimento del Backlog Item
    $scope.openBacklogItemCreationDialog = function() {
        $mdDialog.show({
            controller: 'backlogItemCreationDialogController',
            templateUrl: 'views/scrum/backlogItemCreationDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            // Passaggio dell'id del prodotto selezionato
            resolve: {
                productId: function () {
                    return $scope.selectedProduct.id;
                }
            }
        }).then(function successCallback(){
            // Se la creazione avviene con successo la schermata viene aggiornata
            $scope.populateBacklog();
        }, function errorCallback(){}
        );
    };

    // Apertura di una finestra di dialogo per l'inserimento del Backlog Item nello Sprint Backlog
    $scope.openBacklogItemEditDialog = function(backlogItem) {
        $mdDialog.show({
            controller: 'backlogItemEditDialogController',
            templateUrl: 'views/scrum/backlogItemEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            // Passaggio del prodotto e dell'item selezionato
            resolve: {
                selectedBacklogItem: function () {
                    return backlogItem;
                },
                productId: function () {
                    return $scope.selectedProduct.id;
                }
            }
        }).then(function successCallback(){
                // Se l'utente conferma l'inserimento nello sprint backlog la schermata viene aggiornata
                $scope.populateBacklog();
            }, function errorCallback(){}
        );
    };

    // Apre la finestra di dettaglio contenente le informazioni sull'item del backlog
    $scope.openItemDetailDialog = function(item) {
        $mdDialog.show({
            controller: 'backlogItemDetailDialogController',
            templateUrl: 'views/scrum/backlogItemDetailDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            // Passaggio del prodotto e dell'item selezionato
            resolve: {
                selectedBacklogItem: function () {
                    return item;
                }
            }
        });
    };

    //// DRAG N DROP    //
    $scope.deleteBacklogItem = function (itemId){
        BacklogItemService.deleteBacklogItemService(itemId)
            .then(function successCallback() {
                $scope.populateBacklog();
            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
    };

    // move selected item to product backlog
    $scope.moveInProductBacklog=function() {
        let sourceSprintNumber = null;
        //check if sprint num is undefined or null to avoid javascript crash
        if (typeof ($scope.itemToMove.sprintNumber)!=='undefined' && $scope.itemToMove.sprintNumber!==null){
            sourceSprintNumber = $scope.itemToMove.sprintNumber;
        }
        else {console.log('moving item from prodBacklog to itself',$scope.itemToMove); //no sprint link=>not in a sprint
        //try avoiding duplicate insert in backend without graphic glitches
            // $scope.backlogItems = $filter('filter')($scope.backlogItems,
            //     function(value) {return value.id !== $scope.itemToMove.id;});
            // $scope.backlogItems.push(angular.copy($scope.itemToMove)); return;

        }
        BacklogItemService.moveItemToProductBacklog($scope.itemToMove.id)   //backend movement of item
            .then(function successCallback(item) {
                //ToasterNotifierHandler.showSuccessToast('Operazione avvenuta con successo', '');

                ////removing item from source list to minimize page parts rebuild jobs for angular
                if(sourceSprintNumber===null){  //case moving item from prodBacklog to itself
                    console.log('moving item from prodBacklog to itself')
                    $scope.backlogItems = $filter('filter')($scope.backlogItems,
                        function(value) {return value.id !== $scope.itemToMove.id;});
                }
                else {                          //case moving item from sprint backlog to product backlog (generic)
                    $scope.sprints[sourceSprintNumber].items = $filter('filter')($scope.sprints[sourceSprintNumber].items,
                        function(value) {return value.id !== $scope.itemToMove.id;});
                }
                //adding item to product backlog in view also
                item.sprintNumber=null;
                $scope.backlogItems.push(item);
                $scope.itemToMove.sprintNumber=null;
                $scope.itemToMove.status=null;

            }, function errorCallback(response){
              ToasterNotifierHandler.handleError(response);
        });

    };

    // move dragged item to target Sprint backlog
    $scope.changeItemSprintBacklog = function(event, ui, destSprint){
        //get source sprint number from item to move
        let sourceSprintNumber = null;
        let destSprintNumber=destSprint.number;
        //check if sprint num is undefined or null to avoid
        if (typeof ($scope.itemToMove.sprintNumber)!=='undefined' && $scope.itemToMove.sprintNumber!==null){
            sourceSprintNumber = $scope.itemToMove.sprintNumber;
            if(sourceSprintNumber===destSprintNumber){      //not really moving the item at all!
                console.log('item is already in this sprint backlog');
                //graphic glitches if avoiding reinsert of itself
            }
        }
        //backend item insert in sprint backlog
        BacklogItemService.insertBacklogItemToSprintBacklogService($scope.selectedProduct.id, $scope.itemToMove,destSprint.number)
            .then(function successCallback(item) {
                //ToasterNotifierHandler.showSuccessToast('Operazione avvenuta con successo', '');
                item.sprintNumber=destSprintNumber;                         //set destination sprint N in item to push
                $scope.sprints[destSprintNumber].items.push(item);          //add item to dest sprint list in view
                //removing item from source backlog to minimize page parts rebuild jobs for angular
                if(sourceSprintNumber===null){              //case: moved item is from product backlog -> removing from source list
                    $scope.backlogItems.splice($scope.backlogItems.indexOf($scope.itemToMove),1);
                }
                else {                                      //case: moved item is from another sprint backlog -> removing from source list
                    $scope.sprints[sourceSprintNumber].items.splice($scope.sprints[sourceSprintNumber].items.indexOf($scope.itemToMove),1);
                }
            }, function errorCallback(response){
                if (response.status === 422){
                    $scope.itemToMove.sprintNumber=sourceSprintNumber;
                    ToasterNotifierHandler.showErrorToast('needed sprint creation.');
                } else {
                    ToasterNotifierHandler.handleError(response);
                }
            });

    };


    //set global ref. of the dragged item in view, used in onDrops functions
    $scope.setItemToChange = function(event, ui, item){
        $scope.itemToMove = item;
        console.log( 'fired item:',item);
    };



    // Questa funzione valorizza la priorità di un item in modo tale da poter
    // ordinare le voci all'interno dello Sprint Backlog
    $scope.priorityLevel = function(backlogItem) {
        if (backlogItem.priority === 'HIGH') {
            return 1;
        } else if (backlogItem.priority === 'MEDIUM') {
            return 2;
        } else if (backlogItem.priority === 'LOW'){
            return 3;
        } else {
            return 4;
        }
    };

    $scope.filterSprints = function (sprint){
        return angular.isDefined(sprint);
    };

    initializeProductList();

}]);