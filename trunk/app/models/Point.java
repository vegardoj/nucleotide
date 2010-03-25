package models;

/*
 * Point.java
 *
 * Created: 24.mar.2010 01:11:52
 */

/**
 *
 * @author Martin
 */
public class Point {

    private double x;
    private double y;
    private double mole;
    private double conc;
    private boolean eq;

    public Point(double x, double y, double mole, double conc, boolean eq) {
        this.x = x;
        this.y = y;
        this.mole = mole;
        this.conc = conc;
        this.eq = eq;
    }

    public double getConc() {
        return conc;
    }

    public double getMole() {
        return mole;
    }

    public boolean isEq() {
        return eq;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

}
