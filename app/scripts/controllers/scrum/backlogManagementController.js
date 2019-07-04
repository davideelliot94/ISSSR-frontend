'use strict';

mainAngularModule.controller('backlogManagementController', ['$scope', '$state', '$mdDialog', 'ScrumProductService',
    'ToasterNotifierHandler', 'BacklogItemService', 'SprintCreateDataFactory','DTOptionsBuilder', 'DTColumnDefBuilder', '$filter',
    function ($scope, $state, $mdDialog, ScrumProductService, ToasterNotifierHandler, BacklogItemService,SprintCreateDataFactory,
              DTOptionsBuilder, DTColumnDefBuilder, $filter){

    $scope.selectedProduct = {};
    // backlogItem selected
    $scope.backlogItem = {};
    // list of item in product backlog for selected product
    $scope.backlogItems = {};
    //All sprints of a product
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

        // Popolamento del product backlog
        BacklogItemService.getProductBacklogItemService($scope.selectedProduct.id)
            .then(function successCallback(items) {
                $scope.backlogItems = items;
            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
    };
    // populate sprint backlog of given the sprint with items from backend of the inputted sprint
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
                        sprint.items[i].sprint=sprint;
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

    //get all sprints and related items of selected product from backend
    $scope.getSprintsItemsRelatedToProduct= function () {
            SprintCreateDataFactory.GetAllByProduct($scope.selectedProduct.id, function (sprints) {
                for (let i=0; i<sprints.length; i++) {
                    if (sprints[i].isActive !== false) {
                        $scope.sprints[sprints[i].number] = sprints[i];
                        populateSprintBacklog($scope.sprints[sprints[i].number]);
                    }
                }
            }, function () {
                ToasterNotifierHandler.showErrorToast('Errore nel recupero degli Sprint');
            });
        };

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

    ///dragNdrop methods
    $scope.deleteBacklogItem = function (itemId){
        BacklogItemService.deleteBacklogItemService(itemId)
            .then(function successCallback() {
                $scope.populateBacklog();
            }, function errorCallback(response){
                ToasterNotifierHandler.handleError(response);
            });
    };

    // move item to product backlog
    $scope.moveInProductBacklog=function(event, ui) {
        // console.log('RESET ITEM IN BACKLOG', event, ui, 'item:', $scope.itemToMove);
        // if($scope.itemToMove.sprint===null || typeof $scope.itemToMove.sprint==='undefined'){
        //     ToasterNotifierHandler.showSuccessToast('Already in product backlog');
        //     return;
        // }
        BacklogItemService.moveItemToProductBacklog($scope.itemToMove.id)
            .then(function successCallback() {
            ToasterNotifierHandler.showSuccessToast('Operazione avvenuta con successo', '');
            $scope.sprints[$scope.itemToMove.sprint.number].items = $filter('filter')($scope.sprints[$scope.itemToMove.sprint.number].items,
                function(value) {return value.id !== $scope.itemToMove.id;});
            $scope.backlogItems.push($scope.itemToMove);
            $scope.itemToMove.sprint=null;
            $scope.itemToMove.status=null;

            }, function errorCallback(response){
            if (response.status === 304){
                console.log('ITEM', $scope.itemToMove)
                ToasterNotifierHandler.showSuccessToast('Already in product backlog');

                console.log($scope.backlogItems)

                //TODO RISOLVERE
                // $scope.backlogItems = $filter('filter')($scope.backlogItems,
                //     function(value) {return value.id !== $scope.itemToMove.id;});
                $scope.backlogItems.splice($scope.backlogItems.indexOf($scope.itemToMove),1);
                console.log($scope.backlogItems)
                $scope.backlogItems.push($scope.itemToMove);
                console.log($scope.backlogItems)

            } else {
                ToasterNotifierHandler.handleError(response);
            }
        });

    };

    // move item to target backlog
    $scope.changeItemSprintBacklog = function(event, ui, destSprint){
        let sourceSprint = null;
        if (typeof ($scope.itemToMove.sprint)!=='undefined' && $scope.itemToMove.sprint!==null){
            sourceSprint = $scope.itemToMove.sprint;

            if( destSprint.number === sourceSprint.number){
                ToasterNotifierHandler.showSuccessToast('L\'item è già nello Sprint ' + destSprint.number);

                $scope.sprints[sourceSprint.number].items = $filter('filter')($scope.sprints[sourceSprint.number].items,
                    function(value) {return value.id !== $scope.itemToMove.id;});
                let updatedItem = angular.copy($scope.itemToMove);
                $scope.sprints[sourceSprint.number].items.push(updatedItem);
                return;
            }
        }
        $scope.itemToMove.sprint=destSprint;
        BacklogItemService.insertBacklogItemToSprintBacklogService($scope.selectedProduct.id, $scope.itemToMove)
            .then(function successCallback() {
                ToasterNotifierHandler.showSuccessToast('Operazione avvenuta con successo', '');
                // $mdDialog.hide();
                //update view (already done in backend)
                destSprint.items.push($scope.itemToMove);            //add item to move to dest sprint backlog
                if(sourceSprint===null){
                    $scope.backlogItems.splice($scope.backlogItems.indexOf($scope.itemToMove),1); //double link used for kill removed item
                }
                else {
                    sourceSprint.items.splice(sourceSprint.items.indexOf($scope.itemToMove),1); //double link used for kill removed item
                }
                ui.draggable.remove();                                  //kill drag item
                // $scope.$apply();
                // $scope.itemToMove=null;
                //refresh only source and dest sprint backlog item list after drop
                // populateSprintBacklog(sourceSprint);
                // populateSprintBacklog(destSprint);
            }, function errorCallback(response){
                if (response.status === 422){
                    $scope.itemToMove.sprint=sourceSprint;
                    ToasterNotifierHandler.showErrorToast(
                        'needed sprint creation.');

                } else {
                    ToasterNotifierHandler.handleError(response);
                }
            });

    };
        $scope.setItemToChange = function(event, ui, item){
            $scope.itemToMove = item;
            console.log('setItemOnChange',event,ui,'item:',item);
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