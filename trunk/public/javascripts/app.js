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

    var makeGraph = function(data) {
        if (graph !== null) {
            dojo.destroy(graph);
        }
        
        graph = new dojox.charting.Chart2D("result");

        graph.addPlot("default", {
            type: "Lines",
            markers: true,
            tension: 3
        });

        graph.addAxis("x", {
            font: "normal normal normal 12pt Arial"
        });

        graph.addAxis("y", {
            vertical: true,
            font: "normal normal normal 12pt Arial"
        });

        graph.setTheme(dojox.charting.themes.BlueDusk);
        new dojox.charting.action2d.Tooltip(graph, "default");
        new dojox.charting.action2d.Highlight(graph, "default");

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

        graph.addSeries("pH", data);


        graph.render();
    }

    var fmtDecimals = function(d, n) {
        var factor = Math.pow(10, n);
        return Math.round(d * factor) / factor;
    }
    
    var fmtExp = function(d, n) {
        return new Number(d).toExponential(n);
    }

    var createHandler = function() {
        var button = new dijit.form.Button(
            {
                label: i18n('input_button')
            }, "calculate"
        );

        var input = new dijit.form.ValidationTextBox(
            {
                required: true,
                regExp: "\\d+(\\.\\d+)?",
                invalidMessage: i18n('warning'),
                promptMessage: i18n('input_val1'),
                style: "display: block"
            }, "input"
        );

        dojo.connect(button, "onClick", function(event) {
            event.preventDefault();
            event.stopPropagation();
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
            var deferred = dojo.xhrGet(xhrArgs);
        });
    }

    var createDialog = function() {
        //var color = dijit.byId("resultDialog");
        dialog = new dijit.Dialog(
            {
                title: i18n('result_title'),
                id: "resultDialog",
                content: dojo.byId("result")
            }
        );
        dojo.connect(dijit.byId("calculate"), "onClick", dialog, "show");
    }

    return {

        init: function() {
            createHandler();
            createDialog();
        }

    }
})();

dojo.addOnLoad(nucleotide.init);
