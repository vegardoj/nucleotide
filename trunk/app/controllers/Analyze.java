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

    public static Point[] getPoints(double acidConc, double acidVol, double baseConc,
            double[] baseVols) {

        Point[] result = new Point[baseVols.length];
        boolean eq = false;
        final double moleAcid = (acidConc / 1000) * acidVol;
        double ph, conc;

        for (int i = 0; i < baseVols.length; i++) {
            double baseVol = baseVols[i];
            double moleBase = (baseConc / 1000) * baseVol;
            double diff = moleAcid - moleBase;
            if (diff == 0) {
                eq = true;
                ph = 7;
                conc = 0;
            } else {
                conc = diff / ((acidVol + baseVol) / 1000);
                ph = eq ? 14 - (-Math.log10(conc * -1)) : -Math.log10(conc);
            }

            result[i] = new Point(baseVol, formatDecimals(ph, 2), moleBase, conc);
        }

        return result;
    }

    private static double formatDecimals(final double d, final int n) {
        final double factor = Math.pow(10, n);
        return Math.round(d * factor) / factor;
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
