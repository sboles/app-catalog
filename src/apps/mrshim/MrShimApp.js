(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define("Rally.apps.mrshim.MrShimApp", {
        name: 'rally-mrshim-app',
        extend: "Rally.app.App",
        settingsScope: "workspace",
        componentCls: 'mrshim-app',
        config: {},
        chart:null,

        requires: [
        ],
        items: [
            {
                xtype: 'container',
                itemId: 'mrcontainer',
                cls: 'mrcontainer'
            }
        ],

        help: {
            id: 279
        },

        driveChart: function () {
            this.chart.query();
        },


        launch: function () {
            var self = this;
            this.callParent(arguments);





            var stupidExt = this.down("#mrcontainer")



            var onChartLoaded = function (myfile) {
                self.chart = myfile({
                    el:stupidExt.el.dom,
                    getSetting:function(n) {
                        return self.getSetting(n);
                    },
                    lbapiUrl: function() {
                        var context = Rally.environment.getContext().getDataContext();
                        return Rally.environment.getServer().getLookbackUrl(this.version) + '/service/rally/workspace/' +
                            Rally.util.Ref.getOidFromRef(context.workspace) + '/artifact/snapshot/query';
                    },
                    getVar: function(name) {
                        return {
                            "releaseOid":10758565528,
                            "projectOid":self.getContext().getProject().ObjectID
                        }[name];
                    }
                },jQuery);
                self.driveChart();
            }


            Ext.Loader.injectScriptElement("/moosenshim/require-2.1.11-min.js", function() {
                requirejs.config({
                    "paths": {
                        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min"
                    }
                });
                require(["moosenshim/myfile"], function(myfile) {
                    onChartLoaded(myfile);
                });
                onChartLoaded();
            },function(){},this);


//            var projectSetting = this.getSetting("project");
//
//            this.down('#header').add(this._buildHelpComponent());
//
//            if (Ext.isEmpty(projectSetting)) {
//                var context = this.getContext();
//                this.projectScopeDown = context.getProjectScopeDown();
//                this.project = context.getProject();
//                this.workspace = context.getWorkspace();
//                this.loadChart();
//            } else {
//                this.projectScopeDown = this.getSetting("projectScopeDown");
//                this.loadModelInstanceByRefUri(projectSetting,
//                    function (record) {
//                        this.project = record.data;
//                        this.workspace = record.data.Workspace;
//                        this.loadChart();
//                    },
//                    function () {
//                        throw new Error("Failed to load project '" + projectSetting + "' from WSAPI.");
//                    }
//                );
//            }
        },
        thisIsTheEnd : {}
//
//        _buildHelpComponent: function () {
//            return Ext.create('Ext.Component', {
//                renderTpl: Rally.util.Help.getIcon({
//                    id: this.help.id
//                })
//            });
//        },
//
//        loadModelInstanceByRefUri: function (refUri, success, failure) {
//            var ref = Rally.util.Ref.getRefObject(refUri);
//            Rally.data.ModelFactory.getModel({
//                type: ref.getType(),
//                scope: this,
//                success: function (model) {
//                    model.load(ref.getOid(), {
//                        scope: this,
//                        fetch: ['Name', 'ObjectID', 'Workspace'],
//                        success: success,
//                        failure: failure
//                    });
//                }
//            });
//        },
//
//        loadChart: function() {
//            this.add(this._buildChartAppConfig());
//            this.down('rallychart').on('snapshotsAggregated', this._onSnapshotDataReady, this);
//            this._publishComponentReady();
//        },
//
//        _adjustFinalStateData: function (series) {
//            var stateField = this.getSetting('stateFieldName');
//            var i, j, startVal, finalStates;
//            if (stateField === 'ScheduleState') {
//                finalStates = [ 'Accepted', 'Released' ];
//            } else {
//                finalStates = [ this.getSetting('stateFieldValues').split(',').pop() ];
//            }
//            for (i=0;i<series.length; i++) {
//                if (finalStates.indexOf(series[i].name) >= 0) {
//                    startVal = series[i].data[0];
//                    for (j=0; j < series[i].data.length; j++) {
//                        series[i].data[j] -= startVal;
//                        if(series[i].data[j] < 0) {
//                           series[i].data[j] = 0;
//                        }
//                    }
//                }
//            }
//        },
//
//        _onSnapshotDataReady: function (chart) {
//            this._adjustFinalStateData(chart.chartData.series);
//        },
//
//        _buildChartAppConfig: function() {
//            return {
//                xtype: 'rallychart',
//                storeConfig: this._buildChartStoreConfig(),
//                calculatorType: 'Rally.apps.charts.cfd.project.ProjectCFDCalculator',
//                calculatorConfig: this._buildChartCalculatorConfig(),
//
//                chartColors: Ext.create("Rally.apps.charts.Colors").cumulativeFlowColors(),
//
//                listeners: {
//                    chartRendered: this._publishComponentReady,
//                    scope: this
//                },
//
//                chartConfig: {
//                    chart: {
//                        zoomType: 'xy'
//                    },
//                    title: {
//                        text: this.project.Name + " Cumulative Flow Diagram"
//                    },
//                    xAxis: {
//                        tickmarkPlacement: 'on',
//                        tickInterval: 20,
//                        title: {
//                            text: 'Days'
//                        }
//                    },
//                    yAxis: [
//                        {
//                            title: {
//                                text: 'Count'
//                            }
//                        }
//                    ],
//                    plotOptions: {
//                        series: {
//                            marker: {
//                                enabled: false
//                            }
//                        },
//                        area: {
//                            stacking: 'normal'
//                        }
//                    }
//                }
//            };
//        },
//
//        _buildChartStoreConfig: function() {
//            var config = {
//                context: { workspace: this.workspace._ref },
//                find: this._buildChartStoreConfigFind(),
//                fetch: this._buildChartStoreConfigFetch(),
//                hydrate: this._buildChartStoreConfigHydrate(),
//                compress: true
//            };
//            return Ext.create("Rally.apps.charts.IntegrationHeaders",this).applyTo(config);
//        },
//
//        _buildChartStoreConfigFind: function() {
//            var find = {
//                '_TypeHierarchy': { '$in' : [ -51038, -51006 ] },
//                'Children': null,
//                '_ValidTo'  : { '$gt' : this._buildChartStoreConfigValidFrom() }
//            };
//
//            if (this.projectScopeDown) {
//                find._ProjectHierarchy = this.project.ObjectID;
//            } else {
//                find.Project = this.project.ObjectID;
//            }
//
//            return find;
//        },
//
//        _buildChartStoreConfigValidFrom: function() {
//            var today = this._getNow();
//            var timeFrameUnit = this.getSetting("timeFrameUnit");
//            var timeFrameQuantity = this.getSetting("timeFrameQuantity");
//            var validFromDate = Rally.util.DateTime.add(today, timeFrameUnit, -timeFrameQuantity);
//            return Rally.util.DateTime.toIsoString(validFromDate, true);
//        },
//
//        _getNow: function() {
//            return new Date();
//        },
//
//        _buildChartStoreConfigFetch: function() {
//            var stateFieldName = this.getSetting('stateFieldName');
//            return [stateFieldName, 'PlanEstimate'];
//        },
//
//        _buildChartStoreConfigHydrate: function() {
//            var stateFieldName = this.getSetting('stateFieldName');
//            return [stateFieldName];
//        },
//
//        _buildChartCalculatorConfig: function() {
//            var stateFieldName = this.getSetting('stateFieldName');
//            var stateFieldValues = this.getSetting('stateFieldValues');
//            var startDate = this._buildChartStoreConfigValidFrom();
//            return {
//                stateFieldName: stateFieldName,
//                stateFieldValues: stateFieldValues,
//                startDate: startDate
//            };
//        },
//
//        _publishComponentReady: function() {
//            if (Rally.BrowserTest) {
//                Rally.BrowserTest.publishComponentReady(this);
//            }
//        }

    });

}());
