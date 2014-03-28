define([], function() {
    return function(toload, engineCallback) {
        console.log("loading " + toload);
        require([toload], function(mychart) {
            console.log("mychart is " + mychart);
            engineCallback({
                init : function(shimApi) {
                    if (shimApi) {
                        mychart.api = function() { return shimApi; }
                    } else {
                        mychart.api = function() { throw "init was not called with an api instance"; }
                        mychart.api();
                    }
                    // bulid the chart up front
                    mychart.init();
                    return this;
                },

                prefs: function() {
                    return mychart.prefs();
                },

                launch:function(shimApi) {
                    var visualize = function(data){
                        mychart.visualize(data);
                    }
                    var success = function(data) {
                        mychart.transform(data, visualize);
                    }
                    var error = function (x) { console.log(x); };
                    mychart.query(success,error);
                }
            })
        });
    };
});

