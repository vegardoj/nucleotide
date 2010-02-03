package controllers;

import play.i18n.Lang;
import play.mvc.*;

public class Application extends Controller {

    public static void index() {
        render();
    }

    public static void lang() {
        String locale = params.get("locale");
        if (locale != null) {
            Lang.change(locale);
        }
        index();
    }

}