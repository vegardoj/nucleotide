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
        double[] volumes = new double[] {0, 10, 17, 20, 24, 24.99, 25, 25.01, 26, 28, 30, 50};
        Point[] ph = getPoints(0.10, 25, 0.10, volumes);
        renderJSON(ph);
    }

    // acidConc: Concentration of acid, e.g. 0.10 (M)
    // acidVolume: Volume of acid, e.g. 25 (mL)
    // baseConc: Concentration of base, e.g. 0.10 (M)
    // baseVols: List of base volumes, e.g. [0, 10, 24.99, 25, 25.01, 26, 50] (mL)
    public static Point[] getPoints(double acidConc, double acidVol, double baseConc,
            double[] baseVols) {

        Point[] result = new Point[baseVols.length];
        boolean isBase = false;
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
                isBase = true;
                isEquivalent = true;
            } else {
                conc = diffMole / ((acidVol + baseVol) / 1000);
                if (isBase) { // When we reach the equivalent point we need to calculate the pH differently
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

    /* JavaScript version
        getPh: function(acidConc, acidVolume, baseConc, baseVolumes) {

            // acidConc: Concentration of acid, e.g. 0.10 (M)
            // acidVolume: Volume of acid, e.g. 25 (mL)
            // baseConc: Concentration of base, e.g. 0.10 (M)
            // baseVolume: List of base volumes, e.g. [0, 10, 24.99, 25, 25.01, 26, 50] (mL)

            // List which we will be filling with pH values
            var result = [];

            // Calculate number of mole acid
            var moleAcid = (acidConc / 1000) * acidVolume;

            // Reached equivalent point
            var eq = false;

            // Calculate pH values
            for (var i = 0; i < baseVolumes.length; i++) {
                var moleBase = (baseConc / 1000) * baseVolumes[i];
                var diff = moleAcid - moleBase;
                var ph;
                if (diff === 0) {
                    eq = true;
                    ph = 7;
                } else {
                    var conc = diff / ((acidVolume + baseVolumes[i]) / 1000);
                    // Dividing by log(10) to get log base 10
                    ph = eq ? 14 - (-Math.log(conc * -1) / Math.LN10) : -Math.log(conc) / Math.LN10;
                }

                result.push(ph);
            }

            return result;
        }
    */

}
