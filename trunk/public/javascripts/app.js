dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dojox.charting.Chart2D");

function makeChart() {
    var chart = new dojox.charting.Chart2D("result");
    chart.addPlot("default", {type: "Lines", markers: true,
        tension:3, shadows: {dx: 2, dy: 2, dw: 2}});
    chart.addAxis("x");
    chart.addAxis("y", {vertical: true});
    chart.addSeries("Series 1", [1, 2, 2, 3, 4, 5, 5, 7]);
    chart.render();
}

function sendForm() {
    var button = dijit.byId("button");
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
}

dojo.addOnLoad(sendForm);
