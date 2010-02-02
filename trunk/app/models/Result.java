package models;

import play.db.jpa.Model;

/*
 * Result.java
 *
 * Created: 02.feb.2010 22:57:00
 */

/**
 *
 * @author Martin
 */
public class Result extends Model {

    public double result;

    public Result(double result) {
        this.result = result;
    }

}
