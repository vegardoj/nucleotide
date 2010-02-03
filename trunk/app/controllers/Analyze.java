package controllers;

import models.Analysis;
import play.mvc.Controller;


/*
 * Analyze.java
 *
 * Created: 02.feb.2010 22:48:08
 */

/**
 *
 * @author Martin
 */
public class Analyze extends Controller {

    public static void result() {
        Double volume = params.get("volume", Double.class);
        Double mole = params.get("mole", Double.class);
        Double conc = params.get("conc", Double.class);
        Double ph = params.get("ph", Double.class);

        if (volume == null || mole == null || conc == null || ph == null) {
            response.status = 400;
            renderText("Invalid or missing values");
        } else {
            Analysis a = new Analysis("test", volume, mole, conc, ph);
            //renderJSON(obj); // NICE!
            renderText(_result(a));
        }
    }

    private static double _result(Analysis a) {
        return a.conc * a.mole * a.conc * a.ph;
    }

}
