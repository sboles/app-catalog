(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.printstorycards.Card', {
        extend: 'Ext.Component',
        alias: 'widget.printcard',
        tpl: Ext.create('Ext.XTemplate', '<tpl><div class="artifact">' +
            '<div class="card-header">' +
            '<span class="storyID">{FormattedID}{[this.getParentID(values)]}</span>' +
            '<span class="owner">{[this.getOwnerImage(values)]}</span>' +
            '<span class="ownerText">{[this.getOwnerName(values)]}</span>' +
            '</div>' +
            '<div class="content">' +
            '<div class="card-title">{Name}</div>' +
            '<div class="description">{Description}</div>' +
            '</div>' +
            '<span class="estimate">{[this.getEstimate(values)]}</span>' +
            '</div></tpl>', {
                getOwnerImage: function(values) {
                    return values.Owner && ('<img src="' + Rally.util.User.getProfileImageUrl(40,values.Owner._ref) + '"/>') || '';
                },
                getOwnerName: function(values) {
                    return values.Owner && values.Owner._refObjectName || 'No Owner';
                },
                getParentID: function(values) {
                    return values.WorkProduct && (':' + values.WorkProduct.FormattedID) || '';
                },
                // Tasks have Estimate(s), Stories have PlanEstimate(s)
                getEstimate: function(values) {
                    return values.Estimate || values.PlanEstimate || '';
                }
            }
        )
    });
})();