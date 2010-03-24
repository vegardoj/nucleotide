dojo.require("dojo.parser");
dojo.require("dijit.form.Button");
dojo.require("dojox.charting.Chart2D");
dojo.require("dojox.charting.themes.BlueDusk");
dojo.require("dijit.Dialog");
dojo.require("dojox.charting.action2d.Highlight");
dojo.require("dojox.charting.action2d.Tooltip");
dojo.require("dojox.charting.widget.Legend");


var chartBuilder = (function() {

    var makeGraph = function(data) {
        var c = new dojox.charting.Chart2D("result");

        c.addPlot("default", {
            type: "Lines",
            markers: true,
            tension: 3
        });

        c.addAxis("x", {
            font: "normal normal normal 12pt Arial"
        });

        c.addAxis("y", {
            vertical: true,
            font: "normal normal normal 12pt Arial"
        });
        
        c.setTheme(dojox.charting.themes.BlueDusk);

        for (var i = 0; i < data.length; i++) {
            data[i].tooltip =
                i18n('input_val4') + data[i].y + "<br />" +
                i18n('input_val1') + data[i].x + "<br />" +
                i18n('input_val2') + data[i].mole + "<br />" +
                i18n('input_val3') + data[i].conc + "<br />";
        }

        c.addSeries("pH", data);

        new dojox.charting.action2d.Tooltip(c, "default");
        new dojox.charting.action2d.Highlight(c, "default");


        c.render();
    }

    return {
        createHandler: function() {
            var button = new dijit.form.Button(
                {
                    label: i18n('input_button')
                }, "calculate"
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
        },

        createDialog: function() {
            var color = dijit.byId("resultDialog");
            dojo.connect(dijit.byId("calculate"), "onClick", color, "show");
        }

    }
})();

dojo.addOnLoad(chartBuilder.createHandler);
dojo.addOnLoad(chartBuilder.createDialog);
