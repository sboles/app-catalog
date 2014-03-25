var MrShim = function(scope,$) {
    scope.canRemote = false;

    scope.query = function() {
        console.log("MrShim::query");

        var timeFrameUnit = scope.getSetting("timeFrameUnit");
        console.log("timeFrameUnit", timeFrameUnit);

        var timeFrameQuantity = scope.getSetting("timeFrameQuantity");
        console.log("timeFrameQuantity", timeFrameQuantity);


        var query = {
            find: {
                _TypeHierarchy: "Defect",
                State: {$lte: "Closed" },
                _ProjectHierarchy: scope.getVar("projectOid"),
                Release:  scope.getVar("releaseOid")
            },
            fields: ["_ValidFrom", "_ValidTo", "ObjectID", "ScheduleState"],
            hydrate: ["ScheduleState"]
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

        var lumenize = require('./lumenize')
        config =  {
            granularity: "day",
            validFromField: '_ValidFrom',
            validToField: '_ValidTo',
            uniqueIDField: 'ScheduleState',
            tz : "America/Denver",
            trackLastValueForTheseFields: ['_ValidTo', 'ScheduleState']
        }

        window.tisc = new lumenize.TimeInStateCalculator(config)
        tisc.addSnapshots(data.Results, '2012-01-05T00:00:00.000Z', '2014-01-05T00:00:00.000Z')

        scope.visualize(_.map(tisc.getResults(), function(v) {
            return {name: v.ScheduleState,data:[v.ticks]};
        }));
    }

    scope.visualize = function(data) {
        console.log(data);

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
            series: data
        });
    }

    scope.onValueChange = function(varName, newValue) {
        // this would get called when something like 'scope changed' maybe
    }

    return scope;
};
