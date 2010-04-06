dojo.require("dojo.parser");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.Dialog");
dojo.require("dojox.charting.Chart2D");
dojo.require("dojox.charting.action2d.Highlight");
dojo.require("dojox.charting.action2d.Tooltip");
dojo.require("dojox.charting.themes.BlueDusk");
dojo.require("dojox.charting.widget.Legend");

var nucleotide = (function() {

    var graph = null;
    var createButton = null;
    var volumeInput = null;
    var pointButton = null;
    var dialog = null;

    var makeGraph = function(data) {

        if (graph !== null) {
            return;
        }
        
        graph = new dojox.charting.Chart2D("result");

        graph.addPlot("indicator", {
            type: "Lines",
            markers: false
        });

        graph.addPlot("selected", {
            type: "Lines",
            markers: true
        });

        graph.addPlot("default", {
            type: "Lines",
            markers: true
        });

        graph.addAxis("x", {
            majorTickStep: 10,
            max: 105,
            min: 0,
            font: "normal normal normal 10pt Verdana"
        });

        graph.addAxis("y", {
            majorTickStep: 1,
            max: 14,
            min: 0,
            vertical: true,
            font: "normal normal normal 10pt Verdana"
        });

        graph.setTheme(dojox.charting.themes.BlueDusk);
        new dojox.charting.action2d.Tooltip(graph, "default");
        new dojox.charting.action2d.Highlight(graph, "default");
        new dojox.charting.action2d.Tooltip(graph, "selected");
        new dojox.charting.action2d.Highlight(graph, "selected");

        data = fmtData(data);

        graph.addSeries("pH", data);
        graph.addSeries("PointA", [ {x: 0, y: 7}, {x: 50, y: 7} ],
            {plot: "indicator", stroke: {color:"green"}});
        graph.addSeries("PointB", [ {x: 50, y: 0}, {x: 50, y: 7} ],
            {plot: "indicator", stroke: {color:"green"}});
        graph.addSeries("selectPoint", [], {plot: "selected", stroke: {color:"red"}});

        graph.render();
    }

    var fmtData = function(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].tooltip =
                i18n('input_val4') + fmtDecimals(data[i].y, 2) + "<br />" +
                i18n('input_val1') + fmtDecimals(data[i].x, 2) + "<br />" +
                i18n('input_val2') + fmtExp(data[i].mole, 2) + "<br />" +
                i18n('input_val3') + fmtExp(data[i].conc, 2) + "<br />";
            if (data[i].eq) {
                data[i].tooltip += "<p class=\"eq_point\">" + i18n('desc_point') + "</p>";
            }
        }
        return data;
    }

    var updateSelected = function(data) {
        if (graph !== null) {
            data = fmtData(data);
            graph.updateSeries("selectPoint", data, {plot: "selected", stroke: {color:"red"}});
            graph.render();
        }
    }

    var fmtDecimals = function(d, n) {
        var factor = Math.pow(10, n);
        return Math.round(d * factor) / factor;
    }
    
    var fmtExp = function(d, n) {
        return new Number(d).toExponential(n);
    }

    var setupHandlers = function() {

        if (volumeInput === null) {
            volumeInput = new dijit.form.ValidationTextBox(
                {
                    required: true,
                    regExp: "([0-9]{1,2}|100)(\\.\\d+)?",
                    invalidMessage: i18n('warning'),
                    promptMessage: i18n('input_val1'),
                    style: "display: block"
                }, "input"
            );
        }

        if (createButton === null) {

            createButton = new dijit.form.Button(
                {
                    label: i18n('create_button')
                }, "create"
            );
            dojo.connect(createButton, "onClick", function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (graph === null) {
                    var xhrArgs = {
                        url: "/analyze",
                        handleAs: "json",
                        load: function(data) {
                            makeGraph(data);
                        },
                        error: function(error) {
                            dojo.byId("result").innerHTML = i18n('error');
                        }
                    }
                    var deferred = dojo.xhrPost(xhrArgs);
                }
            });
        }

        if (pointButton === null) {

            pointButton = new dijit.form.Button(
                {
                    label: i18n('input_button')
                }, "calculate"
            );

            dojo.connect(pointButton, "onClick", function(event) {
                event.preventDefault();
                event.stopPropagation();
                var volume = dijit.byId("input").getValue();
                var xhrArgs = {
                    url: "/analyze",
                    postData: "volume=" + volume,
                    handleAs: "json",
                    load: function(data) {
                        updateSelected(data);
                    },
                    error: function(error) {
                        dojo.byId("result").innerHTML = i18n('error');
                    }
                }
                var deferred = dojo.xhrPost(xhrArgs);
            });
        }
    }

    var createDialog = function() {
        //var color = dijit.byId("resultDialog");
        if (dialog === null) {
            dialog = new dijit.Dialog(
                {
                    title: i18n('result_title'),
                    id: "resultDialog",
                    content: dojo.byId("dialog")
                }
            );
            dojo.connect(dijit.byId("create"), "onClick", dialog, "show");
        }
    }

    return {

        init: function() {
            setupHandlers();
            createDialog();
        }

    }
})();

dojo.addOnLoad(nucleotide.init);
