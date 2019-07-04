'use strict';

mainAngularModule.controller('backlogManagementController', ['$scope', '$state', '$mdDialog', 'ScrumProductService',
    'ToasterNotifierHandler', 'BacklogItemService', 'SprintCreateDataFactory','DTOptionsBuilder', 'DTColumnDefBuilder',
    function ($scope, $state, $mdDialog, ScrumProductService, ToasterNotifierHandler, BacklogItemService,SprintCreateDataFactory,
              DTOptionsBuilder, DTColumnDefBuilder){

    $scope.selectedProduct = {};
        // backlogItem selected
        $scope.backlogItem = {};
        // list of item in product backlog for selected product
    $scope.backlogItems = {};
        // list of item in sprint backlog for selected product
    $scope.sprintBacklogItems = {};
    $scope.sprints=[];
    $scope.sprints.items={};
        // default option for datatable
    $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
    $scope.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(4).notSortable()];
    $scope.isActiveSprint = false;
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
        console.clear();
        console.log($scope.selectedProduct);

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
                        priority: 'PLACEHOLDER'
                    });

                    sprint.items = items;
                    //add extra link in item to sprint for cheaper refresh on drop
                    for (var i=0;i<sprint.items.length;i++) {
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
                // $scope.sprints = sprints;
                // console.log('received sprints',sprints);
                for (var i=0;i<sprints.length;i++) {
                    if (sprints[i].isActive !== false) {                //SKIP CLOSED SPRINT
                        $scope.sprints.push(sprints[i]);
                        populateSprintBacklog(sprints[i]);
                    }
                }
                console.log('FINAL SPRINTS',$scope.sprints);
            }, function (response) {
                ToasterNotifierHandler.handleError(response);
            });
        };

    ///DIALOGS
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
        console.log('RESET ITEM IN BACKLOG', event, ui, 'item:', $scope.itemToMove);
        if($scope.itemToMove.sprint===null || typeof $scope.itemToMove.sprint==='undefined'){
            ToasterNotifierHandler.showSuccessToast('Already in product backlog');
            return;
        }
        BacklogItemService.moveItemToProductBacklog($scope.itemToMove.id)
            .then(function successCallback() {
            ToasterNotifierHandler.showSuccessToast('Operazione avvenuta con successo', '');
            $mdDialog.hide();
            $scope.backlogItems.push($scope.itemToMove);            //add item to current view (already done in backend :)
            $scope.itemToMove.sprint.items.splice($scope.itemToMove.sprint.items.indexOf($scope.itemToMove),1); //double link used for kill removed item
            ui.draggable.remove();                                  //kill drag item
            // $scope.$apply();
            //reset field for later check
            $scope.itemToMove.sprint=null;
            $scope.itemToMove.status=null;

            }, function errorCallback(response){
            if (response.status === 304){
                ToasterNotifierHandler.showSuccessToast('AAlready in product backlog');
            } else {
                ToasterNotifierHandler.handleError(response);
            }
        });

    };

    // move item to target backlog
    $scope.changeItemSprintBacklog = function(event, ui, destSprint){
        console.log('CHANGING ITEM BACKLOG' ,event,ui,'dest sprint:',destSprint);
        let sourceSprint=null;
        if(typeof ($scope.itemToMove.sprint)!=='undefined' &&$scope.itemToMove.sprint!==null){
            sourceSprint=$scope.itemToMove.sprint;
            if( destSprint.number===sourceSprint.number){
                ToasterNotifierHandler.showSuccessToast('Already in sprint backlog '+ destSprint.number);
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


    initializeProductList();

}]);