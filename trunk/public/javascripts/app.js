dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.ValidationTextBox");

function sendForm() {
    var button = dijit.byId("analyze");
    dojo.connect(button, "onClick", function(event) {
        event.preventDefault();
        event.stopPropagation();
        var xhrArgs = {
            form: dojo.byId("analyze_form"),
            handleAs: "text",
            load: function(data) {
                dojo.byId("result").innerHTML = data;
            },
            error: function(error) {
                dojo.byId("result").innerHTML = i18n('error');
            }
        }
        var deferred = dojo.xhrPost(xhrArgs);
    });
}
dojo.addOnLoad(sendForm);
