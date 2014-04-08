(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.printcards.printstorycards.PrintStoryCardsApp', {
        extend: 'Rally.app.TimeboxScopedApp',
        alias: 'widget.printstorycards',
        requires: [
            'Rally.data.wsapi.Store',
            'Rally.apps.printcards.PrintCard',
            'Rally.app.plugin.Print'
        ],
        plugins: [{
            ptype: 'rallyappprinting'
        }],
        componentCls: 'printcards',
        scopeType: 'iteration',

        launch: function() {
            this.add({
                xtype: 'container',
                itemId: 'cards'
            });
            this.callParent(arguments);
        },

        onScopeChange: function(scope) {
            this.down('#cards').removeAll();
            this._loadStories(scope);
        },

        _loadStories: function(scope) {
            Ext.create('Rally.data.wsapi.Store', {
                autoLoad: true,
                model: Ext.identityFn('UserStory'),
                fetch: ['FormattedID', 'Name', 'Owner', 'Description', 'PlanEstimate'],
                limit: (scope.getRecord()) ? 200 : 50,
                listeners: {
                    load: this._onStoriesLoaded,
                    scope: this
                },
                filters: [
                    scope.getQueryFilter()
                ]
            });
        },

        _onStoriesLoaded: function(store, records) {
            _.each(records, function(record, idx) {
                this.down('#cards').add({
                    xtype: 'printcard',
                    data: record.data
                });

                if (idx%4 === 3) {
                    this.down('#cards').add({
                        xtype: 'component',
                        cls: 'pb'
                    });
                }
            }, this);
            if(Rally.BrowserTest) {
                Rally.BrowserTest.publishComponentReady(this);
            }
        },

        getOptions: function() {
            return [
                this.getPrintMenuOption({title: 'Print Story Cards App'}) //from printable mixin
            ];
        }
    });
})();