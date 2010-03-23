dojo.require("dojo.parser");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dojox.charting.Chart2D");
dojo.require("dijit.Dialog");

var chartBuilder = (function() {
    var chart = null;
    var makeChart = function() {
        if (chart !== null) {
            //console.log("chart exists, destroying");
            chart.destroy();
        }
        chart = new dojox.charting.Chart2D("result");
        chart.addPlot("default", {type: "Lines", markers: false,
            tension:3, shadows: {dx: 20, dy: 13, dw: 2}});
        chart.addAxis("x");
        chart.addAxis("y", {vertical: true});
        chart.addSeries("Series 1", [1, 2, 2, 3, 4, 5, 5, 7]);
        chart.render();
    };
    return {
        sendForm: function() {
            var button = dijit.byId("calculate");
            dojo.connect(button, "onClick", function(event) {
                event.preventDefault();
                event.stopPropagation();
                var xhrArgs = {
                    form: dojo.byId("input"),
                    handleAs: "text",
                    load: function(data) {
                        makeChart();
                    },
                    error: function(error) {
                        dojo.byId("result").innerHTML = i18n('error');
                    }
                }
                var deferred = dojo.xhrPost(xhrArgs);
            });
        },
        createDialog: function() {
            var color = dijit.byId("resultDialog");
            dojo.connect(dijit.byId("calculate"), "onClick", color, "show");
        }
    }
})();
dojo.addOnLoad(chartBuilder.sendForm);
dojo.addOnLoad(chartBuilder.createDialog);
