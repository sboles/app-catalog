(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.printstorycards.PrintStoryCardsApp', {
        extend: 'Rally.app.TimeboxScopedApp',
        alias: 'widget.printstorycards',
        requires: [
            'Rally.data.wsapi.Store',
            'Rally.apps.printstorycards.Card',
            'Rally.app.plugin.Print'
        ],
        plugins: [{
            ptype: 'rallyappprinting'
        }],
        componentCls: 'printcards',
        scopeType: 'iteration',
        comboboxConfig: {
            itemId: 'box',
            fieldLabel: 'Select Iteration: ',
            labelWidth: 100,
            width: 300
        },

        items: [
            {
                xtype: 'container',
                itemId: 'cards'
            }
        ],

        onScopeChange: function(scope) {
            this.down('#cards').removeAll();
            this._loadStories(scope);
        },

        _loadStories: function(scope) {
            Ext.create('Rally.data.wsapi.Store', {
                autoLoad: true,
                model: Ext.identityFn('UserStory'),
                fetch: ['FormattedID', 'Name', 'Owner', 'Description', 'PlanEstimate'],
                limit: Infinity,
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
            Ext.Array.each(records, function(record, idx) {
                if (record.get('PlanEstimate') === null) {
                    record.set('PlanEstimate', 'None');
                }

                this.down('#cards').add({
                    xtype: 'printcard',
                    data: record.data
                });

                if (idx%4 === 3) {
                    this.down('#cards').add({
                        xtype: 'component',
                        html: '<div class="pb"></div>'
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