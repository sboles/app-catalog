(function ($) {
	$(document).ready(function () {
		var engine = null;

		requirejs.config({
			'paths': {
				'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
				'highcharts': '/mrshim/highcharts-3.0.10',
				'highcharts-shim': '/mrshim/highcharts-shim',
				'is': '/mrshim/is',
				'is-api': '/mrshim/is-api',
				'hasHighcharts': '/mrshim/hasHighcharts',
				'lumenize-0.7.3-shim':'/mrshim/lumenize-0.7.3-shim',
				'lumenize-0.7.3-min':'/mrshim/lumenize-0.7.3-min',
				'underscore':'/mrshim/underscore',
                'underscore-shim': '/mrshim/underscore-shim',
                'hasUnderscore' : '/mrshim/hasUnderscore',
                'engine': '/mrshim/engine'
			},
			shim: {
				'highcharts': {
					'exports': 'Highcharts',
					'deps': [ 'jquery']
				},
				'lumenize-0.7.3-min': {
					exports: 'require'
				}
			}
		});


		var shimApi = {
			el: function() {
				  // this evaluation needs to occur delayed
				  var el = $('#mrcontainer').get(0);
				  return el;
			},
			getPreference:function(n) {
				  return n + ' value';
			},
			lbapiUrl: function() {
				// if proxy, or if 'local'
				var context = '/proxy/analytics/v2.0/service/rally/workspace/41529001/artifact/snapshot/query.js';
				return context;
			},
			getProject: function() { return 279050021; },
			getRelease: function() { return 10758565528; },
			toggleEnabled : function(name) { return name || false; }
		};

        var toload = '/mrshim/myfile.js';
        var self = this;
        require(['engine'],function(engineFactory) {
            engineFactory(toload, function(loadedEngine){
                self.engine = loadedEngine;
                self.engine.init(shimApi);
                // self.appPrefs = self.engine.prefs();
                // _.each(self.appPrefs, function(pref) {
                //     if (pref.default) {
                //         self.defaultSettings[pref.name] = pref.default;
                //     }
                // });
                self.engine.launch();
            });
        });
	});
})(jQuery);
