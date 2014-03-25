var MrShim = function(scope,$) {
    scope.canRemote = false;

    scope.query = function() {
        console.log("MrShim::query");

//        var today = this._getNow();
        var timeFrameUnit = scope.getSetting("timeFrameUnit");
        console.log("timeFrameUnit", timeFrameUnit);

        var timeFrameQuantity = scope.getSetting("timeFrameQuantity");
        console.log("timeFrameQuantity", timeFrameQuantity);

//        var validFromDate = Rally.util.DateTime.add(today, timeFrameUnit, -timeFrameQuantity);
//        return Rally.util.DateTime.toIsoString(validFromDate, true);


        var query = {
            find: {
                _TypeHierarchy: "Defect",
                State: {$lte: "Closed" },
                _ProjectHierarchy: scope.getVar("projectOid"),
                Release:  scope.getVar("releaseOid")
            },
            fields: ["_ValidFrom", "_ValidTo", "ObjectID", "ScheduleState"],
            hydrate: ["ScheduleState"]/*,

            pageSize: 200,
            sort: {'_ValidFrom': 1},
            compress: true*/
        }


        console.log("Query", scope.lbapiUrl());
        console.log(query);
        var data = JSON.stringify(query, undefined, 2);
        console.log(data);
        jQuery.ajax({
                url:scope.lbapiUrl(),
                data: data,
                error: function (x) { console.log(x); },
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                    console.log(textStatus);
                    scope.transform(data);
                },
                contentType: "application/json",
                type: "POST",
                dataType: "json"
        });
    }

    scope.transform = function(data) {
        console.log("MrShim::transform");
        var transformed = {};
        _.each(data.Results, function(r) {
            transformed[r.ScheduleState] = transformed[r.ScheduleState] || 0;
            transformed[r.ScheduleState]++;
        });
        scope.visualize(transformed);
    }

    scope.visualize = function(data) {

        console.log("MrShim::visualize");

        var series = [];
        _.map(data, function(v,k) {
            series.push({name: k, data: [v]});
        });

        console.log(series);

        var chart = new Highcharts.Chart({
            chart: {
                renderTo: scope.el.id,
                type: 'bar',
                marginRight: 130,
                marginBottom: 25
            },
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            /*xAxis: {
                categories: _.keys(data)
            },*/
            yAxis: {
                title: {
                    text: 'Defect State Counts'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+ this.y;
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: series
                /*[{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]*/
        });
    }
    scope.onValueChange = function(varName, newValue) {
        // this would get called when something like 'scope changed' maybe
    }
    return scope;
};
