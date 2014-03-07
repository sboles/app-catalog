(function() {
    var Ext = window.Ext4 || window.Ext;

    /**
     * Iteration Tracking Board App
     * The Iteration Tracking Board can be used to visualize and manage your User Stories and Defects within an Iteration.
     */
    Ext.define('Rally.apps.iterationtrackingboard.IterationTrackingBoardApp', {
        extend: 'Ext.Container',

        autoScroll: true,

        initComponent: function() {
            this.getContext = function() {
                return {
                    isFeatureEnabled: function() { return true; }
                }
            };
            this.showGridSettings = this.getContext().isFeatureEnabled('ITERATION_TRACKING_BOARD_GRID_TOGGLE');
            this.callParent(arguments);
            this._loadModels();
        },

        _addGridBoard: function(compositeModel, treeGridModel) {
            this._addGrid(this._getGridConfig(treeGridModel));
        },

        _addGrid: function(gridConfig){
            this.remove('gridBoard');

            this.gridboard = this.add(gridConfig);
        },

        _getGridConfig: function(treeGridModel, columns) {
            var gridConfig = {
                storeConfig: {
                    autoLoad: true
                }
            };

            if (true) {
                var parentTypes = ['HierarchicalRequirement', 'Defect', 'DefectSuite'];
                Ext.apply(gridConfig, {
                    xtype: 'rallytreegrid',
                    model: treeGridModel,
                    parentFieldNames: {
                        defect: ['Requirement', 'DefectSuite'],
                        task: ['WorkProduct'],
                        testcase: ['WorkProduct']
                    },
                    storeConfig: {
                        parentTypes: parentTypes,
                        childTypes: ['Defect', 'Task', 'TestCase'],
                        filters: [{
                            property: 'Iteration.Name',
                            value: 'second iteration'
                        }],
                        sorters: [{
                            property: Rally.data.Ranker.getRankField(treeGridModel),
                            direction: 'ASC'
                        },{
                            property: 'TaskIndex',
                            direction: 'ASC'
                        }],
                        fetch: ['FormattedID', 'Tasks', 'Defects', 'TestCases']
                    },
                    treeColumnRenderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                        store = store.treeStore || store;
                        return Rally.ui.renderer.RendererFactory.getRenderTemplate(store.model.getField('FormattedID')).apply(record.data);
                    },
                    columnCfgs: ['Name', 'Blocked'],
                    pageResetMessages: [Rally.app.Message.timeboxScopeChange],
                    isLeaf: Rally.apps.iterationtrackingboard.IsLeafHelper.isLeaf,
                    getIcon: function(record) {
                        return '';
                    }
                });
            }
            return gridConfig;
        },

        _loadModels: function() {
            var topLevelTypes = ['User Story', 'Defect', 'Defect Suite'],
                allTypes = topLevelTypes.concat(['Task', 'Test Case']);
            Rally.data.ModelFactory.getModels({
                types: allTypes,
                success: function(models) {
                    var topLevelModels = _.filter(models, function(model, key) {
                            return _.contains(topLevelTypes, key);
                        }),
                        compositeModel = Rally.domain.WsapiModelBuilder.buildCompositeArtifact(topLevelModels, this.getContext()),
                        treeGridModel;
                    this.modelNames = topLevelTypes;
                    this.allModelNames = allTypes;
                    treeGridModel = Rally.domain.WsapiModelBuilder.buildCompositeArtifact(_.values(models), this.getContext());
                    this._addGridBoard(compositeModel, treeGridModel);
                },
                scope: this
            });
        },

        _onLoad: function() {
            this._publishContentUpdated();
            this.recordComponentReady();
        }
    });
})();
