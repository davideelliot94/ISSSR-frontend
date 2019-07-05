'use strict';
mainAngularModule
    .controller('ProductSoftwareListCtrl', ['$scope', '$window', 'ToasterNotifierHandler', 'softwareProductDataFactory', 'ErrorStateRedirector', 'DTOptionsBuilder',
        'DTColumnDefBuilder', 'ScrumProductWorkflowService', 'ScrumProductService', '$filter',
        function ($scope, $window, ToasterNotifierHandler, softwareProductDataFactory,
                  ErrorStateRedirector, DTOptionsBuilder, DTColumnDefBuilder,
                  ScrumProductWorkflowService, ScrumProductService, $filter) {

            var ctrl = this;
            ctrl.refreshProduct = refreshProductFn;
            ctrl.editProduct = editProductFN;
            ctrl.deleteProduct = deleteProductFN;
            ctrl.retireTarget = retireTargetFN;
            ctrl.rehabTarget = rehabTargetFN;
            ctrl.isRetired = isRetiredFN;

            $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
            $scope.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(4).notSortable()];

            refreshProductFn();

            function refreshProductFn() {
                softwareProductDataFactory.GetAll(
                    function (products) {
                        ctrl.products = products;
                        // Costruzione dell'array contenente tutti i prodotti non assegnati
                        for (let i = 0; i < products.length; i++){
                            if (products[i].scrumTeamId === -1){
                                $scope.notAssignedproducts.push(products[i]);
                            }
                        }
                    }, function () {
                        ToasterNotifierHandler.showErrorToast('Errore nel recupero dei prodotti');
                    });

            }

            function editProductFN(sProduct) {
                console.log("update product with id: " + sProduct.id);
                softwareProductDataFactory.Update(sProduct,
                    function () {
                        refreshProductFn();
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nella modifica del prodotto"});
                    });

            }

            function deleteProductFN(id) {
                console.log("delete product with id: " + id);
                softwareProductDataFactory.Remove(id,
                    function () {
                        refreshProductFn();
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'eliminazione del prodotto"});
                    });

            }


            /**
             * @ngdoc               function
             * @name                removeTarget
             * @description         Function sets a Target as "Unavailable" via an HTTP PUT.
             *
             * @param index         id row of the Target
             */
            function retireTargetFN($index) {

                let targetToRetire = ctrl.products[$index];
                let id = targetToRetire.id;

                softwareProductDataFactory.Retire(id, function (response) {
                        ctrl.products[$index].targetState = "RETIRED";
                    },
                    function error(response) {
                        console.log("Error!" + response);
                    });
            };


            /**
             * @ngdoc               function
             * @name                rehabTarget
             * @description         Function sets an unavailable Target as "Available" again via an HTTP PUT.
             *
             * @param index         id row of the Target
             */
            function rehabTargetFN($index) {

                let targetToRehab = ctrl.products[$index];
                let id = targetToRehab.id;

                softwareProductDataFactory.Rehab(id, function (response) {
                        ctrl.products[$index].targetState = "ACTIVE";
                    },
                    function error(response) {
                        console.log("Error!" + response);
                    });
            };


            /**
             * @ngdoc               function
             * @name                isRetired
             * @description         Function checks if a Target is "Unavailable" or not.
             *
             * @param index         id row to check
             * @returns {boolean}   true is the Target is "Unavailable", false otherwise
             */
            function isRetiredFN($index) {
                if (ctrl.products[$index].targetState === "RETIRED")
                    return true;
                else
                    return false;
            };


// ___________________________________________________PARTE SCRUM_______________________________________________

            $scope.assignProduct = function() {
                ScrumProductService.assignProductToScrumTeam($scope.association.scrumTeam.id,
                    $scope.association.product.id, $scope.association.workflow.id)
                    .then(function successCallback(association) {
                        ToasterNotifierHandler.showSuccessToast('Operazione avvenuta con successo');
                        $scope.assignments.push(association);
                        $scope.notAssignedproducts = $filter('filter')($scope.notAssignedproducts,
                            function(value) {return value.name !== association.product;});
                    }, function errorCallback(){
                        ToasterNotifierHandler.showErrorToast('Errore nell\'assegnamento del prodotto');
                    });
            };

            // Associazione in fase di costruzione
            $scope.association = {};
            // Associazioni preesistenti
            $scope.assignments = [];
            // Prodotti non assegnati
            $scope.notAssignedproducts = [];


            // Recupera tutti gli assegnamenti tra prodotti e scrum team esistenti
            function getExistentAssignments(){
                ScrumProductService.getExistentAssignmentsService()
                    .then(function successCallback(response) {
                        $scope.assignments = response;
                    }, function errorCallback(){
                        ToasterNotifierHandler.showErrorToast('Errore nel recupero delle ' +
                            'associazioni esistenti');
                    });
            }

            // Recupera tutti i workflow per i prodotti Scrum
            function getScrumProductWorkflows(){
                ScrumProductWorkflowService.getAllScrumProductWorkflowService()
                    .then(function successCallback(response) {
                        $scope.scrumProductWorkflows = response.data;
                    }, function errorCallback(){
                        ToasterNotifierHandler.showErrorToast('Errore nel recupero degli Scrum' +
                            ' Product Workflow ');
                    });
            }

            // Recupera tutti gli scrum team nel sistema
            function getScrumTeams(){
                softwareProductDataFactory.GetScrumTeamList(
                    function successCallback(response) {
                        $scope.scrumTeams = response;
                    }, function errorCallback(){
                        ToasterNotifierHandler.showErrorToast('Errore nel recupero degli Scrum Team');
                    });
            }

            $scope.setScrumTeam = function (scrumTeam) {
                $scope.association.scrumTeam = scrumTeam;
            };
            $scope.setWorkflow = function (workflow) {
                $scope.association.workflow = workflow;
            };

            $scope.setProduct = function (product) {
                $scope.association.product = product;
            };

            getExistentAssignments();
            getScrumTeams();
            getScrumProductWorkflows();

        }]);