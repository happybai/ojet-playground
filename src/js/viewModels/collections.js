/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojrouter', 'ojs/ojdatagrid',
'ojs/ojcollectiondatagriddatasource'],
 function(oj, ko, moduleUtils) {
    function CollectionsViewModel() {
      var self = this;

      var collection = new oj.Collection(null, {
        url: 'https://5b5ac2e250bab80014e5f7c4.mockapi.io/api/v1/users'
      });

      this.dataSource = new oj.CollectionDataGridDataSource(collection,
        { rowHeader: 'id', columns: [
          'avatar',
          'name',
          'title',
          'country',
          'createdAt'
        ]}
      );

      self.router = oj.Router.rootInstance;
      self.collectionsRouter = self.router.getChildRouter('collections');

      self.moduleConfig = ko.observable({'view':[], 'viewModel':null});

      self.modulePath = ko.pureComputed(
        function() {
          var name = self.collectionsRouter.moduleConfig.name();
          return (name === 'oj:blank'? name: 'collections/' + name);
        }
      );

      self.loadModule = function() {
        ko.computed(function() {
          var name = self.collectionsRouter.moduleConfig.name();
          var viewPath = '/js/views/collections/' + name + '.html';
          var modelPath = '/js/viewModels/collections/' + name + '.js';
          var masterPromise = Promise.all([
            moduleUtils.createView({'viewPath': viewPath}),
            moduleUtils.createViewModel({'viewModelPath': modelPath})
          ]);
          masterPromise.then(
            function(values){
              self.moduleConfig({'view':values[0],'viewModel':values[1]});
            },
            function(reason){}
          );
        });
      };
      self.loadModule();

      self.display = ko.observable("all");
      self.edge = ko.observable("end");

      // this.selectedItem = ko.observable("home");

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function() {
        self.router.collectionsRouter.sync()
        self.router.sync()
      }

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete. * That includes any possible animation between the old and the new View. */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new CollectionsViewModel();
  }
);
