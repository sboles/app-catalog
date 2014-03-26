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



        launch: function () {
            var self = this;
            this.callParent(arguments);


            // get the element we're going to use as the container (defined above in items)
            // this .down call is Ext specific
            var stupidExt = this.down("#mrcontainer");

            // create the API that will be passed in (the execution context if you will) to the
            // chart that's loaded


            // feature toggles are an ENVIRONMENT/shim specific thing and are NOT
            // exposed to the chart apps. ??? it seems like maybe chart apps could
            // still make use of toggles.?

            // provide port(s) for the chart app to use
            var shimApi = {
                el: function() {
                    // this evaluation needs to occur delayed
                    return stupidExt.el.dom;
                },
                getSetting:function(n) {
                    return self.getSetting(n);
                },
                lbapiUrl: function() {
                    var context = Rally.environment.getContext().getDataContext();
                    return Rally.environment.getServer().getLookbackUrl(this.version) + '/service/rally/workspace/' +
                        Rally.util.Ref.getOidFromRef(context.workspace) + '/artifact/snapshot/query';
                },
                getProject: function() { return self.getContext().getProject().ObjectID; },
                getRelease: function() { return 10758565528; },
                toggleEnabled : function(name) { return false;}
            }


            // example - binding events to the chart app
            Ext4.EventManager.onWindowResize(function() {
                if (self.chart.onResize) {
                    self.chart.onResize();
                }
            }, this);



            Ext.Loader.injectScriptElement("/moosenshim/require-2.1.11-min.js", function() {
                requirejs.config({
                    "paths": {
                        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
                        "highcharts": "/moosenshim/highcharts-3.0.10",
                        "highcharts-shim": "/moosenshim/highcharts-shim",
                        "is": "/moosenshim/is",
                        "is-api": "/moosenshim/is-api",
                        "hasHighcharts": "/moosenshim/hasHighcharts"
                    },
                    shim: {
                        "highcharts": {
                            "exports": "Highcharts",
                            "deps": [ "jquery"]
                        }
                    }
                });
                require(["moosenshim/myfile"], function(mychart) {
                    self.chart = mychart.init(shimApi);
                    self.chart.launch();
                });
            },function(){},this);


        }
    });

}());
