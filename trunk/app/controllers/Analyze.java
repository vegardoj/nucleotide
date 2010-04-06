package controllers;

import models.Point;
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

        //System.out.println(volume);

        Point[] ph;
        if (volume == null) {
            double[] volumes = new double[] {
                0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
                48, 49.5, 49.95, 49.99, 50, 50.01, 50.05, 50.5, 52,
                55, 60, 65, 70, 75, 80, 85, 90, 95, 100
            };
            ph = getPoints(0.10, 50, 0.10, volumes);
        } else {
            ph = getPoints(0.10, 50, 0.10, new double[] {volume});
        }
        renderJSON(ph);
    }

    // acidConc: Concentration of acid, e.g. 0.10 (M)
    // acidVolume: Volume of acid, e.g. 25 (mL)
    // baseConc: Concentration of base, e.g. 0.10 (M)
    // baseVols: List of base volumes, e.g. [0, 10, 24.99, 25, 25.01, 26, 50] (mL)
    public static Point[] getPoints(double acidConc, double acidVol, double baseConc,
            double[] baseVols) {

        Point[] result = new Point[baseVols.length];
        boolean isEquivalent = false;
        final double moleAcid = (acidConc / 1000) * acidVol;

        double pH, conc;

        for (int i = 0; i < baseVols.length; i++) {
            double baseVol = baseVols[i];
            double baseMole = (baseConc / 1000) * baseVol;
            double diffMole = moleAcid - baseMole;
            if (diffMole == 0) { // This is the equivalent point
                pH = 7;
                conc = 0;
                isEquivalent = true;
            } else {
                conc = diffMole / ((acidVol + baseVol) / 1000);
                if (conc < 0) { // When we reach the equivalent point we need to calculate the pH differently
                    conc = -conc;
                    pH = 14 + Math.log10(conc);
                } else {
                    pH = -Math.log10(conc);
                }
                isEquivalent = false;
            }

            result[i] = new Point(baseVol, pH, baseMole, conc, isEquivalent);
        }

        return result;
    }

}
