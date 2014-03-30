define([], function() {
    return function(toload, engineCallback) {
        console.log("loading " + toload);
        require([toload], function(mychart) {
            console.log("mychart is " + mychart);
            engineCallback({
                init : function(shimApi) {
                    if (shimApi) {
                        this.api = mychart.api = function() { return shimApi; }
                    } else {
                        this.api = mychart.api = function() { throw "init was not called with an api instance"; }
                        this.api();
                    }
                    // bulid the chart up front
                    mychart.init();
                    return this;
                },

                prefs: function() {
                    return mychart.prefs();
                },

                launch:function() {
                    var self = this;
                    var visualize = function(data){
                        self.api().log('visualizing data');
                        self.api().log('  calling "visualize"');
                        mychart.visualize(data);
                        self.api().log('done visualizing data');
                    }
                    var success = function(data) {
                        self.api().log('transforming data', data);
                        mychart.transform(data, visualize);
                        self.api().log('done transforming data');
                    }
                    var error = function (x) { 
                        self.api().log("Error", x);
                    };
                    this.api().log('running query')
                    mychart.query(success,error);
                }
            })
        });
    };
});

