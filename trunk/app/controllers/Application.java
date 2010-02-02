package controllers;

import java.util.Map;
import play.i18n.Lang;
import play.mvc.*;

public class Application extends Controller {

    public static void index() {
        String locale = params.get("locale");
        if (locale != null) {
            Lang.change(locale);
        }
        render();
    }

}